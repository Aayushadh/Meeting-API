//GK
// Routes for meetings
// Create meeting
//Read all meetings
//Read meeting by dates 
// Delete meeting by id 
// Update meeting
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Meeting = require("../models/meeting");
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
});

module.exports = router;
