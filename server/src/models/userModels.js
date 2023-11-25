const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");

const { defaultImagePath } = require("../secrete.js");

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
      trim: true,
      minLength: [3, "Name must be at least 3 characters long"],
      maxLength: [20, "Name must be less than 20 characters long"],
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      trim: true,
      unique: true,
      lowercase: true,
      validate: {
        validator: function (v) {
          return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(v);
        },
        message: (props) => `${props.value} is not a valid email address!`,
      },
    },
    password: {
      type: String,
      required: [true, "Please enter your password"],
      minLength: [3, "Password must be at least 3 characters long"],
      set: (v) => bcrypt.hashSync(v, bcrypt.genSaltSync(10)),
    },
    image: {
      type: String,
      default: defaultImagePath,
    },
    address: {
      type: String,
      required:   [true, "Please enter your address"],
    },
    phone: {
      type: String,
      required: [true, "Please enter your phone number"],
      validate: {
        validator: function (v) {
          return /^[0-9]+$/.test(v);
        },
        message: (props) => `${props.value} is not a valid phone number!`,
      },
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const User = model("Users", userSchema);
module.exports = User;
