const express = require('express')
const router = express.Router()
const storage = require('./googleSheetsService')

router.get('/', (request, response) => {
  response.sendFile('public/index.html', { root: __dirname })
})

router.post('/submit-form', (request, response) => {
  const body = request.body

  console.log(body)
  const arr = [body.forename, body.surname, body.emailAddress]
  storage(arr)

  response.status(201).end()
})

module.exports = router
