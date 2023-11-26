const express = require("express");
const {
  getUsers,
  getUserByID,
  deleteUserById,
  processRegister,
  activateUserAccount,
} = require("../controller/userController");
const { get } = require("mongoose");
const userRouter = express.Router();

// GET: api/users
userRouter.post("/process-register", processRegister);
userRouter.post("/verify", activateUserAccount);
userRouter.get("/", getUsers);
userRouter.get("/:id", getUserByID);
userRouter.delete("/:id", deleteUserById);

module.exports = userRouter;
