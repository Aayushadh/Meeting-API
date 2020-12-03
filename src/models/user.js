//DH

// required modules
const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Meeting = require("./meeting");

// field that should be in this model
/**
 *Name 
 Email 
 Password  apply authentication middleware 
 Time stamps 
 *  */

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      require: true,
      unique: true,
      /* match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/*/
      validate: [{ validator: validator.isEmail, msg: "Invalid email" }],
    },
    password: {
      type: String,
      required: true,
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

userSchema.virtual("meetings", {
  ref: "Meeting",
  localField: "_id",
  foreignField: "user_id",
});

userSchema.methods.generateAuthToken = async function () {
  const user1 = this;
  const token = jwt.sign(
    {
      _id: user1._id.toString(),
    },
    process.env.JWT_TOKEN
  );
  user1.tokens = user1.tokens.concat({
    token,
  });
  await user1.save();
  return token;
};

userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
});

userSchema.statics.findByCredentials = async (email, password) => {
  const user1 = await User.findOne({
    email,
  });
  if (!user1) {
    throw new Error("User not exists");
  }

  const isMatch = await bcrypt.compare(password, user1.password);
  if (!isMatch) {
    throw new Error("Wrong Password");
  }

  return user1;
};

userSchema.pre("remove", async function (next) {
  const user = this;
  await Meeting.deleteMany({
    user_id: user._id,
  });
});
const User = mongoose.model("User", userSchema);
module.exports = User;
