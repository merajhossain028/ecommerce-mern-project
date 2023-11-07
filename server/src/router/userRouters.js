const express = require('express');
const { getUsers } = require('../controller/userController');
const userRouter = express.Router();

// GET: api/users
userRouter.get("/", getUsers);

module.exports = userRouter;