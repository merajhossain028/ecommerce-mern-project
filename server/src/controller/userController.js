const createError = require("http-errors");
const User = require("../models/userModels");
const { successResponse } = require("./responseController");
const mongoose = require("mongoose");
const { findUserById } = require("../services/findUser");

const getUsers = async (req, res, next) => {
  try {
    const search = req.query.search || "";
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;

    const searchRegex = new RegExp(".*" + search + ".*", "i");
    const filter = {
      isAdmin: { $ne: true },
      $or: [
        { name: searchRegex },
        { email: searchRegex },
        { phone: searchRegex },
      ],
    };

    const options = { password: 0, __v: 0, createdAt: 0, updatedAt: 0 };

    const users = await User.find(filter, options)
      .limit(limit)
      .skip(limit * (page - 1));

    const count = await User.find(filter).countDocuments();

    if (!users) {
      return next(createError(404, "Users were not found!"));
    }

    return successResponse(res, {
      success: 200,
      message: "Users were returned successfully!",
      payload: {
        users,
        pagination: {
          totalPage: Math.ceil(count / limit),
          currentPage: page,
          previousPage: page - 1 > 0 ? page - 1 : null,
          nextPage: page + 1 <= Math.ceil(count / limit) ? page + 1 : null,
        },
      },
    });
  } catch (error) {
    console.log(error);
  }
};
const getUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await findUserById(id);
    return successResponse(res, {
      success: 200,
      message: "User were returned successfully!",
      payload: { user },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getUsers, getUser };
