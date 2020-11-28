// AH
// connecting database server 
require('./db/mongoose')

// required modules
const express = require('express')
const multer = require('multer')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// models
const user = require('./models/user')
const meeting = require('./models/meeting')

// routes
const userRoutes = require('./routers/userRoutes')
const meetingRoutes = require('./routers/meetingRoutes')

const app = express()

app.use(express.json())
app.use(userRoutes)
app.use(meetingRoutes)

// listening to a port 
const port = process.env.PORT
app.listen(port, () => {
	console.log('Successfully running...' + port)
})
