//AH
<<<<<<< HEAD
//starting server for database 

const dotenv = require('dotenv')
const mongoose = require('mongoose')
require('dotenv').config()
mongoose.connect(process.env.MONGODB_URL, {
	useNewUrlParser: true,
    useCreateIndex: true,
	useFindAndModify: false,
	useUnifiedTopology: true,});
    mongoose.connection.once('open', function(){
      console.log('Conection has been made!');
    }).on('error', function(error){
        console.log('Error is: ', error);
    });
mongoose.Promise = global.Promise
=======
//starting server for database

const dotenv = require("dotenv");
const mongoose = require("mongoose");
require("dotenv").config();
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});
mongoose.connection
  .once("open", function () {
    console.log("Conection has been made!");
  })
  .on("error", function (error) {
    console.log("Error is: ", error);
  });
mongoose.Promise = global.Promise;
>>>>>>> 057bb624ddd72f8599f4ec7a31046456bf1fb363
