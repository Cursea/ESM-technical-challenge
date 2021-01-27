const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')

const routes = require('./routes')

app.use(cors())
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: true }))
app.use('/', routes)
app.use(express.static('public'))

module.exports = app
