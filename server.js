require('dotenv').config({path:"./config.env"})
const express = require('express');
const connectDB = require('./config/db')
const errorHandler = require('./middleware/error')

// connect db 
connectDB()

const app = express()

app.use(express.json())
app.use("/api/auth", require('./routes/auth'))
app.use("/api/private",require('./routes/private'))
app.use(errorHandler)

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => console.log(`Server listening on port ${PORT}`))

process.on('unhandledRejection', (err,Promise) => {
    console.log(`Logged Error : ${err}`)
    server.close(() => process.exit(1))
})


