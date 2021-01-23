const express = require('express')
const router = express.Router()

router.get('/', (request, response) => {
  response.sendFile('./index.html', { root: __dirname })
})

module.exports = router
