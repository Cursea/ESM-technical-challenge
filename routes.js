const express = require('express')
const router = express.Router()

router.get('/', (request, response) => {
  response.sendFile('public/index.html', { root: __dirname })
})

router.post('/submit-form', (request, response) => {
  const body = request.body

  response.status(201)
  response.send(body)
  response.end()
})

module.exports = router
