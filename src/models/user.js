//DH

// required modules
<<<<<<< HEAD
const mongoose = require('mongoose')
const validator = require('validator')
=======
const mongoose = require("mongoose");
const validator = require("validator");
>>>>>>> 057bb624ddd72f8599f4ec7a31046456bf1fb363

// field that should be in this model
/**
 *Name 
 Email 
 Password  apply authentication middleware 
 Time stamps 
 *  */
<<<<<<< HEAD
=======

const userSchema= mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    Name:{type: String,required:true},
    email:{
        type:String,
        require: true,
        unique: true,
       /* match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/*/
        validate: [{ validator: validator.isEmail, msg: 'Invalid email' }]
    },
    password: {
        type: String ,
         required :true
       }},
       {timestamps:true}
)

module.exports = mongoose.model('User',userSchema) 
>>>>>>> 057bb624ddd72f8599f4ec7a31046456bf1fb363
