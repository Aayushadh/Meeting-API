const jwt = require("jsonwebtoken");
const User = require("../models/user");
const asyncHandler = require("express-async-handler");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");

    const decoded = jwt.verify(token, process.env.JWT_TOKEN);

    const user1 = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });

    if (!user1) {
      throw new Error("Token expired");
    }
    req.user = user1;
    req.token = token;
    next();
  } catch (e) {
    console.log(e);
    res.status(401).send({
      error: "Please authenticate",
    });
  }
};

module.exports = auth;
