const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const routes = require('./routes')

app.use(bodyParser.json())
app.use('/', routes)
app.use(express.static('public'))

module.exports = app
