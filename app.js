const express = require('express')
const logger = require('morgan')
const cors = require('cors')
const path = require('path')
const { HttpCode } = require('./helpers/constants')
const contactsRouter = require('./routes/api/contacts')
const usersRouter = require('./routes/api/users')
require('dotenv').config()

const app = express()

const AVATARS_OF_USERS = process.env.AVATARS_OF_USERS
app.use(express.static(path.join(__dirname, AVATARS_OF_USERS)))

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short'

app.get('env') !== 'test' && app.use(logger(formatsLogger))
app.use(cors())
app.use(express.json())

app.use('/api/contacts', contactsRouter)
app.use('/api/users', usersRouter)

app.use((req, res) => {
  res.status(HttpCode.NOT_FOUND).json({ message: 'Not found' })
})

app.use((err, req, res, next) => {
  res
    .status(err.status || HttpCode.INTERNAL_SERVER_ERROR)
    .json({ message: err.message })
})

module.exports = app
