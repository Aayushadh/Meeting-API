//GK
// Routes for meetings
// Create meeting
//Read all meetings
<<<<<<< HEAD
//Read meeting by dates 
// Delete meeting by id 
=======
//Read meeting by dates
// Delete meeting by id
>>>>>>> 057bb624ddd72f8599f4ec7a31046456bf1fb363
// Update meeting
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Meeting = require("../models/meeting");
<<<<<<< HEAD
const checkAuth = require('../middleware/auth');
const moment = require('moment')

// Handle incoming GET requests to /orders
router.post("/meeting", (req, res, next) => {
    const meeting = new Meeting({
      _id: new mongoose.Types.ObjectId(),
      user_id: new mongoose.Types.ObjectId(),
      topic: req.body.topic,
      description: req.body.description,
      date: req.body.date,
      dateAndtime: req.body.dateAndtime,
      link: req.body.link,
      antendees: req.body.antendees,
      time_stamps: moment().format('MMMM Do YYYY, h:mm:ss a')
    });
    meeting
      .save()
      .then(result => {
        console.log(result);
        res.status(201).json({
          message: "Meeting Created successfully ",
          createdMeeting: {
            Topic: result.topic,
            "Date and Time": result.dateAndtime,
            "Time Stamps": result.time_stamps,
            user: result.user_id
          }
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  });

router.get("/meeting", (req, res, next) => {
    Meeting.find()
      .select("_id user_id topic description dateAndtime link antendees time_stamps")
      .exec()
      .then(docs => {
        const response = {
          count: docs.length,
          meetings: docs.map(doc => {
            return {
              meeting : doc
              
            };
          })
        };
        res.status(200).json(response);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  });

router.get("/meeting/:meetingdate", (req, res, next) => {
  const Meet_date = req.params.meetingdate;
  Meeting.find({date:Meet_date})
    .select("_id user_id topic description dateAndtime link antendees time_stamps")
    .exec()
    .then(doc => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json({
          meeting: doc
        });
      } else {
        res
          .status(404)
          .json({ message: "There is no Meetings " });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.delete("/meeting/:meetingId", (req, res, next) => {
  const id = req.params.meetingId;
  Meeting.remove({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Meeting deleted"
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.patch("/meeting/:meetingId", (req, res, next) => {
  const id = req.params.meetingId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Meeting.updateMany({ _id: id }, { $set: updateOps })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Meeting updated"
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
=======
const checkAuth = require("../middleware/auth");
const moment = require("moment");

// Handle incoming POST requests to /meeting/

router.post("/meeting", async (req, res) => {
  const obj = new Meeting({
    ...req.body,
    user_id: 123,
  });
  try {
    await obj.save();
    res.status(201).send(obj);
  } catch (e) {
    console.log(e);
    res.status(400).send(e.message);
  }
});

// Handle incoming GET requests to /meeting/

router.get("/meeting", async (req, res) => {
  
  const meetings = await Meeting.find({});

  try {
    res.status(200).send(meetings);
  } catch (e) {
    res.status(500).send(e);
  }
});



const checkEpoch = async (obj) => {
  if (parseInt(obj.dateAndtime) < Math.floor(new Date().getTime() / 1000.0)) {
    await Meeting.findOneAndUpdate({ _id: obj._id }, { finished: true });
  }
  return parseInt(obj.dateAndtime) >= Math.floor(new Date().getTime() / 1000.0);
};

router.get("/meeting/pending", async (req, res) => {
  const arr = await Meeting.find({ finished: false });

  const arr1 = arr.filter(checkEpoch);
  console.log(arr1);
  try {
    res.status(200).send(arr1);
  } catch (e) {
    res.status(404).send(e);
  }
});

router.delete("/meeting/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const obj = await Meeting.findOneAndDelete({
      _id,
    });
    if (!obj) {
      return res.status(404).send("NOT Found");
    }
    res.status(200).send({ message: "Deleted Successfully" });
  } catch (e) {
    res.status(500).send(e);
  }
});
router.delete("/meeting/", async (req, res) => {
  try {
    const obj = await Meeting.deleteMany({});

    res.status(200).send({ message: "Deleted Successfully" });
  } catch (e) {
    console.log(e.message);
    res.status(500).send(e);
  }
});

router.patch("/meeting/:id", async (req, res) => {
  const _id = req.params.id;
  const fields = [
    "description",
    "finished",
    "topic",
    "dateAndtime",
    "link",
    "attendees",
  ];
  const updates = Object.keys(req.body);
  const isValid = updates.every((inst) => fields.includes(inst));
  if (!isValid) {
    return res.status(400).send({
      error: "Bad Fields",
    });
  }

  try {
    const updates = Object.keys(req.body);
    const obj = await Meeting.findOne({
      _id,
    });

    if (!obj) {
      return res.status(404).send("NOT Found");
    }

    updates.forEach((update) => {
      obj[update] = req.body[update];
    });

    await obj.save();

    res.status(200).send(obj);
  } catch (e) {
    res.status(400).send(e.message);
  }
>>>>>>> 057bb624ddd72f8599f4ec7a31046456bf1fb363
});

module.exports = router;
