const express = require('express');
const { getUsers, getUser } = require('../controller/userController');
const { get } = require('mongoose');
const userRouter = express.Router();

// GET: api/users
userRouter.get("/", getUsers);
userRouter.get('/:id', getUser);

module.exports = userRouter;