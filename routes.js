const express = require('express')
const router = express.Router()

router.get('/', (request, response) => {
  response.send('API data read/write challenge')
})

module.exports = router
