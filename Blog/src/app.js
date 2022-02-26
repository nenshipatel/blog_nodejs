const express = require('express')
require('./db/mongoose')
const User = require('../src/models/user')

const userRouter = require('../src/router/user')
const topicRouter = require('../src/router/topic')
const postsRouter = require('../src/router/posts')
const app= express()
const port=process.env.PORT||3000;

app.use(express.json());

app.use(userRouter)
app.use(topicRouter)
app.use(postsRouter)


module.exports = app
