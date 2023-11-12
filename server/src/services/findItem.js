const createError = require("http-errors");
const mongoose = require("mongoose");
const User = require("../models/userModels");

const findWithId = async (id, options = {}) => {
  try {
    const item = await User.findById(id, options);
    if (!item) {
      throw createError(404, "Item was not found!");
    }
    return item;
  } catch (error) {
    if (error instanceof mongoose.Error) {
      throw createError(400, "Invalid Item id!");
    }
    throw error;
  }
};

module.exports = { findWithId };
