require('dotenv').config()

const express = require('express')
const app = express()
const PORT = 3000;
const mongoose = require('mongoose')

mongoose.connect(process.env.DATABASE_URL)

const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database'))

app.use(express.json())
const bloggingRouter = require('./routes/blogging')

app.use('/blogging', bloggingRouter)


app.listen(PORT, () => console.log('Server Started'))
