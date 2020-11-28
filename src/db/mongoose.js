//AH
//starting server for database 

const dotenv = require('dotenv')
const mongoose = require('mongoose')

dotenv.config()

mongoose.connect(process.env.MONGODB_URL, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useFindAndModify: false,
	useUnifiedTopology: true,
})
