const express = require("express");
const {
  getUsers,
  getUser,
  deleteUser,
} = require("../controller/userController");
const { get } = require("mongoose");
const userRouter = express.Router();

// GET: api/users
userRouter.get("/", getUsers);
userRouter.get("/:id", getUser);
userRouter.delete("/:id", deleteUser);

module.exports = userRouter;
