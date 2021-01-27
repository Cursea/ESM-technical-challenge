const { request } = require('express')
const express = require('express')
const router = express.Router()
const storage = require('./googleSheetsService')

router.get('/', (request, response) => {
  response.sendFile('public/index.html', { root: __dirname })
})

router.get('/details', (request, response) => {
  response.sendFile('public/submit-form.html', { root: __dirname })
})

router.post('/submit-form', (request, response) => {
  const body = request.body
  console.log(body)

  const formContent = [body.forename, body.surname, body.emailAddress]
  storage(formContent)

  response.status(201).end()
})

module.exports = router
