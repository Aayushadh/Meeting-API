//DH
// Routes for users 
// Create User 
//Read User 
// Delete User 
// Update User 
// Login 
// Logour

const express=require('express')
const router=express.Router()
const bcrypt= require('bcrypt')
const mongoose = require('mongoose')
const jwt= require('jsonwebtoken')


const User = require('../models/user')
const auth = require('../middleware/auth');



router.post('/signup',(req,res,next) => {
    User.find({email: req.body.email}).exec()
    .then(user =>{
        if(user.length >=1){
            res.status(409).json({
                message: 'Mail already exists'
            })
        }
        else{
            if(req.body.password.length >= 6){
                if(req.body.con_password == req.body.password){
                    bcrypt.hash(req.body.password,10,(err,hash) => {
                        if(err){
                            res.status(500).json({
                                error: err
                           })
                        }
                        else{
                           const user= new User({
                               _id: new mongoose.Types.ObjectId(),
                                Name:req.body.Name,
                                email: req.body.email,
                                password: hash
                           })
                           user
                           .save()
                           .then(result => {
                               console.log(result)
                                res.status(200).json({
                                    message: 'Account is created successfully'
                                })
                           })
                           .catch(err => {
                               console.log(err)
                                res.status(500).json({
                                    error: err
                                })
                           })
                       }
                    })
                }
                else{
                    res.status(500).json({
                        message:'Auth Failed'
                    })
                }
             }
           else{
               res.json({
                   message: 'Password should be larger than 6 letters'
               })
           }
        }
    })
})

router.post('/login',(req, res, next) => {
    User.find({ email: req.body.email })
      .exec()
      .then(user => {
        if (user.length < 1) {
          return res.status(401).json({
            message: "Auth failed"
          });
        }
        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
          if (err) {
            return res.status(401).json({
              message: "Auth failed"
            });
          }
          if (result) {
            const token = jwt.sign(
              {
                email: user[0].email,
                userId: user[0]._id
              },
              process.env.JWT_KEY,
              {
                expiresIn: "1h"
              }
            );
            return res.status(200).json({
              message: "Auth successful",
              token: token
            });
          }
          res.status(401).json({
            message: "Auth failed"
          });
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
    });
})

router.get('/:userId',auth,(req,res,next) => {
    User.findById(req.params.userId)
    .select("Name email")
    .exec()
    .then(doc => {
        res.status(200).json({
          UserDetails: doc
       })
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
})

router.patch('/:userId',auth,(req, res, next) => {
    const id = req.params.userId;
    const updateOps = {};
    for (const ops of req.body) {
      updateOps[ops.propName] = ops.value;
    }
    User.update({ _id: id }, { $set: updateOps })
      .exec()
      .then(result => {
        res.status(200).json({
          message: "User details updated",
          request: {
            type: "GET",
            url: "http://localhost:3000/user/" + id
          }
        });
      })
      .catch(err => {
        res.status(500).json({
          error: err
        });
    });
})

router.delete('/:userId',auth,(req, res, next) => {
    const id = req.params.userId;
    User.remove({ _id: id })
      .exec()
      .then(result => {
        res.status(200).json({
          message: "User deleted"
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
    });
})

router.get('/:userId/logout',auth,async(req,res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return req.token != token.token;
        })

        await req.user.save();
        res.send("Successfully logged out!");

    } catch {
        res.status(500).send();

    }
})

module.exports= router
