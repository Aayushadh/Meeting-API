const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const auth = require("../middleware/auth");


// 1 Signup 

router.post("/signup", async (req, res) => {
  
  const obj = new User(req.body);

  try {
    const user = await User.findOne({ email: obj.email });
    if (user) {
      throw new Error("User already exists!");
    }

    if (obj.password < 8) {
      throw new Error("Password must contain atleast 8 characters");
    }
    const token = await obj.generateAuthToken();
    await obj.save();
    res.status(201).send({
      user: obj,
      token,
      success:"Successfully Registerd !!"
    });
  } catch (e) {
    console.log(e);
    res.status(400).send({ error: e.message });
  }
});


// 2 Login 

router.post("/login", async (req, res) => {
  try {
    const user1 = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user1.generateAuthToken();
    res.send({
      user: user1,
      token,
      success:"Logged in !!"
    });
  } catch (e) {
    res.status(400).send({error: e.message });
  }
});

// 3 LogOut

router.get("/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return req.token != token.token;
    });

    await User.findByIdAndUpdate(req.user._id, { tokens: req.user.tokens });
    res.send({
		success: 'Successfully logged out!',
	})
  } catch {
    res.status(500).send({error:'something went wrong'});
  }
});

//4  Logout all the sessions 

router.get("/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];

    await req.user.save();
    res.send({success:"Logged out of all sessions !!!!!!"});
  } catch {
    res.status(500).send();
  }
});

// 5 Get user profile

router.get("/me", auth, async (req, res) => {
  const user2 =  req.user
  res.send({
    user: user2,
  });
});

// 6 Get user profile by id 

router.get("/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const user1 = await User.findById(_id);
    if (!user1) {
      return res.status(404).send("Not Found");
    }
    res.status(200).send(user1);
  } catch (e) {
    res.status(400).send({error:e.message});
  }
});

//7  update  user profile 

router.patch('/me', auth, async (req, res) => {
	const _id = req.user.id
	const fields = ['name', 'password']
	const updates = Object.keys(req.body)
	const isValid = updates.every((inst) => fields.includes(inst))
	if (!isValid) {
		console.log('hello')
		return res.status(400).send({
			error: 'Bad Fields',
		})
	}
	try {
		const user1 = await User.findByIdAndUpdate(_id)
		updates.forEach((update) => (user1[update] = req.body[update]))

		await user1.save()

		res.status(200).send(user1)
	} catch (e) {
		res.status(400).send(e)
	}
})

// 8 deactivate account 

router.delete("/me", auth, async (req, res) => {
  try {
    await req.user.remove();
    res.send({message:"Deleted Successfully !!"});
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;
