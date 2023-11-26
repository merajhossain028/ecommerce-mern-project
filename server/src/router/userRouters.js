const express = require("express");
const {
  getUsers,
  getUserByID,
  deleteUserById,
  processRegister,
  activateUserAccount,
} = require("../controller/userController");
const { get } = require("mongoose");
const upload = require("../middlewears/uploadFile");
const userRouter = express.Router();

// GET: api/users
userRouter.post("/process-register", upload.single("image"), processRegister);
userRouter.post("/verify", activateUserAccount);
userRouter.get("/", getUsers);
userRouter.get("/:id", getUserByID);
userRouter.delete("/:id", deleteUserById);

module.exports = userRouter;
