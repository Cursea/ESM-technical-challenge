const { request } = require('express')
const express = require('express')
const router = express.Router()
const storage = require('./google-service')
const fetch = require('node-fetch')

router.get('/', (request, response) => {
  response.sendFile('public/index.html', { root: __dirname })
})

router.get('/details', (request, response) => {
  response.sendFile('public/user-details.html', { root: __dirname })

  const fetchData = async () => {
    const data = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/1YxSQJtAqrW8ivFhU4ISgSr8-xIBEkXMLP-mTb1w2gtk/values/Sheet1!A2:C2`
    )

    const jsonData = await data.json()
    return jsonData
  }
  console.log(fetchData())
})

router.post('/submit-form', (request, response) => {
  const body = request.body
  console.log(body)

  const formContent = [body.forename, body.surname, body.emailAddress]
  storage(formContent)

  response.status(201).end()
})

module.exports = router
