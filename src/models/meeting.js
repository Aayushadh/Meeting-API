//GK 

// required modules
const mongoose = require('mongoose')
const validator = require('validator')

// field that should be in this model
/**
 * Topic 
 * Description 
 * Date
 * Time 
 * Venue/Link
 * Antendees
 * Time stamps
 *  */ 

const meetingSchema=  mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"},
    _id: mongoose.Schema.Types.ObjectId,
    topic: { type: String, required: true} ,
    description: { type: String, required: true},
    date: {type: String, required: true},
    dateAndtime: { type: String, required: true},
    link: { type: String, required : true},
    antendees: { type: String, required : true},
    time_stamps: { type: String, required: true}
});

module.exports= mongoose.model('Meeting',meetingSchema)