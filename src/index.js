// AH
// connecting database server
require("./db/mongoose");

// required modules
const multer = require("multer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");

// models
//const user = require('./models/user')
const meeting = require("./models/meeting");

// routes
 const userRoutes = require('./routers/userRoutes')
const meetingRoutes = require("./router/meetingRoutes");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept,Authorization"
  );
  if (req.method == "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT,POST,PATCH,DELETE,GET");
    return res.status(200).json({});
  }
  next();
});

app.use(express.json());
app.use('/user',userRoutes)
app.use(meetingRoutes);

// listening to a port
const port = process.env.PORT;
app.listen(port, () => {
  console.log("Successfully running..." + port);
});

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
