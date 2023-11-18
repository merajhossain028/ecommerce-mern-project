const createError = require("http-errors");
const fs = require("fs").promises;

const User = require("../models/userModels");
const { successResponse } = require("./responseController");
const { findWithId } = require("../services/findItem");
const { deleteImage } = require("../helper/deleteImage");
const { createJsonWebToken } = require("../helper/jsonwebtoken");
const { jwtActivationKey } = require("../secrete");

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
const getUserByID = async (req, res, next) => {
  try {
    const id = req.params.id;
    const options = { password: 0 };
    const user = await findWithId(User, id, options);
    return successResponse(res, {
      success: 200,
      message: "User were returned successfully!",
      payload: { user },
    });
  } catch (error) {
    next(error);
  }
};
const deleteUserById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const options = { password: 0 };
    const user = await findWithId(User, id, options);

    const userImagePath = user.image;

    deleteImage(userImagePath);

    const deletedUser = await User.findByIdAndDelete({
      _id: id,
      isAdmin: false,
    });

    if (!deletedUser) {
      return next(createError(404, "User was not found!"));
    }

    return successResponse(res, {
      success: 200,
      message: "User was returned successfully!",
    });
  } catch (error) {
    next(error);
  }
};

const processRegister = async (req, res, next) => {
  try {
    const { name, email, password, phone, address } = req.body;

    const userExist = await User.findOne({ emai: email })
    
    
    if (userExist == null) {
      throw createError(409, "Email already exists! Please try another one.");
    }

    // create jwt
    const token = createJsonWebToken(
      { name, email, password, phone, address },
      jwtActivationKey,
      "10m"
    );
    console.log(token);

    return successResponse(res, {
      success: 200,
      message: "User was create successfully!",
      payload: { token },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getUsers, getUserByID, deleteUserById, processRegister };
