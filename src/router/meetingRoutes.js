const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Meeting = require("../models/meeting");
const auth = require("../middleware/auth");
const moment = require("moment");

// 1 Add meeting by user  (Auth required) 

router.post("/add", auth, async (req, res) => {
  const obj = new Meeting({
    ...req.body,
    user_id: req.user._id,
  });
  try {
    await obj.save();
    res.status(201).send(obj);
  } catch (e) {
    console.log(e);
    res.status(400).send({ message: e.message });
  }
});

// 2 Get list of all meeting 

router.get("/all", async (req, res) => {
  const meetings = await Meeting.find({});

  try {
    res.status(200).send(meetings);
  } catch (e) {
    res.status(500).send(e);
  }
});


// function to checkEpoch of meeting with current epoch

const checkEpoch = async (obj) => {
  if (parseInt(obj.dateAndtime) < Math.floor(new Date().getTime() / 1000.0)) {
    await Meeting.findOneAndUpdate({ _id: obj._id }, { finished: true });
  }
  return parseInt(obj.dateAndtime) >= Math.floor(new Date().getTime() / 1000.0);
};

// 3 Get All pending meetings

router.get("/pending", async (req, res) => {
  const arr = await Meeting.find({ finished: false });
  const arr1 = arr.filter(checkEpoch);
  console.log(arr1);
  try {
    res.status(200).send(arr1);
  } catch (e) {
    res.status(404).send(e);
  }
});

// 4 get pending meeting by logged in user

router.get("/pending/me",auth, async (req, res) => {
  const arr = await Meeting.find({ user_id:req.user._id,finished:false});
  const arr1 = arr.filter(checkEpoch);
  try {
    res.status(200).send(arr1);
  } catch (e) {
    res.status(404).send(e);
  }
});

// 5 all meeting added by loggedin user

router.get('/all/me', auth, async (req, res) => {
	const arr = await Meeting.find({ user_id: req.user._id })
	const arr1 = arr
	try {
		res.status(200).send(arr1)
	} catch (e) {
		res.status(404).send(e)
	}
})



// 6 to delete meeting by id (auth required)

router.delete("/:id", auth, async (req, res) => {
  const _id = req.params.id;
  console.log("hello")
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

// 7  to delete all meetings (clear DB)

router.delete("/all", auth, async (req, res) => {
  try {
    const obj = await Meeting.deleteMany({});

    res.status(200).send({ message: "Deleted Successfully" });
  } catch (e) {
    console.log(e.message);
    res.status(500).send(e);
  }
});

// 8 update meetings by Id

router.patch("/:id", auth, async (req, res) => {
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
