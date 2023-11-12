const createError = require("http-errors");
const mongoose = require("mongoose");
const User = require("../models/userModels");

const findUserById = async (id) => {
  try {
    const options = { password: 0 };
    const user = await User.findById(id, options);
    if (!user) {
      throw createError(404, "User was not found!");
    }
    return user;
  } catch (error) {
    if (error instanceof mongoose.Error) {
      throw createError(400, "Invalid user id!");
    }
    throw error;
  }
};

module.exports = { findUserById };
