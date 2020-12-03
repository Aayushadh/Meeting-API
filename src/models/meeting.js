<<<<<<< HEAD
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
=======
//GK

// required modules
const mongoose = require("mongoose");
const validator = require("validator");

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

const meetingSchema = mongoose.Schema(
  {
    // user_id: { type: mongoose.Schema.Types.ObjectId,
    //     required: true,
    //     ref: "User"},
    topic: { type: String, required: true },
    description: { type: String, required: true },
    dateAndtime: { type: String, required: true },
    link: { type: String, required: true },
    finished: { type: Boolean, required: true, default: false },
    attendees: { type: String, required: true },
  },
  { timestamps: true }
);

const convertEpoch = (input) => {
  var myDate = new Date(input); // Your timezone!
  var myEpoch = myDate.getTime() / 1000.0;
  return myEpoch;
};

meetingSchema.pre("save", async function (next) {
  const meeting = this;
  if (meeting.isModified("dateAndtime")) {
    meeting.dateAndtime = convertEpoch(meeting.dateAndtime);
  }
  if (
    parseInt(meeting.dateAndtime) < Math.floor(new Date().getTime() / 1000.0)
  ) {
    throw new Error("Enter Valid date");
  }
});
module.exports = mongoose.model("Meeting", meetingSchema);
>>>>>>> 057bb624ddd72f8599f4ec7a31046456bf1fb363
