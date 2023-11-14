const express = require("express");
const {
  getUsers,
  getUserByID,
  deleteUserById,
} = require("../controller/userController");
const { get } = require("mongoose");
const userRouter = express.Router();

// GET: api/users
userRouter.get("/", getUsers);
userRouter.get("/:id", getUserByID);
userRouter.delete("/:id", deleteUserById);

module.exports = userRouter;
