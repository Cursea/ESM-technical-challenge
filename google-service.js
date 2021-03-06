const fs = require('fs')
const readline = require('readline')
const { google } = require('googleapis')
require('dotenv').config()

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets']
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json'

function update(data) {
  const credentials = process.env.GOOGLE_CREDENTIALS

  // Try to load client secrects from .env, if exists, else check credentials.json
  if (credentials) {
    authorize(JSON.parse(credentials), updateSheetData, data)
  } else {
    // Load client secrets from a local file.
    fs.readFile('credentials.json', (err, content) => {
      if (err) return console.log('Error loading client secret file:', err)
      // Authorize a client with credentials, then call the Google Sheets API.
      authorize(JSON.parse(content), updateSheetData, data)
    })
  }
}

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback, callbackData) {
  const { client_secret, client_id, redirect_uris } = credentials.installed
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  )

  if (process.env.GOOGLE_TOKEN) {
    oAuth2Client.setCredentials(JSON.parse(process.env.GOOGLE_TOKEN))
    callback(oAuth2Client, callbackData)
  } else {
    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
      if (err) return getNewToken(oAuth2Client, callback)
      oAuth2Client.setCredentials(JSON.parse(token))
      callback(oAuth2Client, callbackData)
    })
  }
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  })
  console.log('Authorize this app by visiting this url:', authUrl)
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close()
    oAuth2Client.getToken(code, (err, token) => {
      if (err)
        return console.error('Error while trying to retrieve access token', err)
      oAuth2Client.setCredentials(token)
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err)
        console.log('Token stored to', TOKEN_PATH)
      })
      callback(oAuth2Client)
    })
  })
}

/**
 * Adds the resource value data to the following google sheet:
 * @see https://docs.google.com/spreadsheets/d/1YxSQJtAqrW8ivFhU4ISgSr8-xIBEkXMLP-mTb1w2gtk/edit
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
 */
function updateSheetData(auth, data) {
  const sheets = google.sheets({ version: 'v4', auth })
  sheets.spreadsheets.values.update(
    {
      spreadsheetId: '1YxSQJtAqrW8ivFhU4ISgSr8-xIBEkXMLP-mTb1w2gtk',
      range: 'Sheet1!A2:C2',
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [data],
      },
    },
    (err, result) => {
      if (err) {
        return console.log('The API returned an error: ' + err)
      } else {
        console.log(`${result.data.updatedCells} cells appended.`)
      }
    }
  )
}

module.exports = update
