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
});

module.exports = router;
