const createError = require("http-errors");
const jwt = require("jsonwebtoken");
const fs = require("fs").promises;

const User = require("../models/userModels");
const { successResponse } = require("./responseController");
const { findWithId } = require("../services/findItem");
const { deleteImage } = require("../helper/deleteImage");
const { createJsonWebToken } = require("../helper/jsonwebtoken");
const { jwtActivationKey, clientURL, smtpUserName } = require("../secrete");
const { emailWithNodeMail } = require("../helper/email");
const { trace } = require("console");

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
    const userExist = await User.findOne({ email: email });
    if (userExist) {
      throw createError(409, "Email already exists! Please try another one.");
    }

    // create jwt
    const token = createJsonWebToken(
      { name, email, password, phone, address },
      jwtActivationKey,
      "10m"
    );
    console.log(token);

    // prepare email
    const emailData = {
      email,
      subject: "Account activation link",
      html: `
        <h2>Please click on given link to activate your account</h2>
        <p>Please click here to <a href="${clientURL}/api/users/activate/${token}" target="_blank">activate your account</a></p>
        <hr />
        <p>This email may contain sensetive information</p>
      `,
    };

    try {
      //await emailWithNodeMail(emailData);
    } catch (emailError) {
      next(
        createError(500, "Email could not be sent! Please try again later.")
      );
      return;
    }

    return successResponse(res, {
      success: 200,
      message: `Please go to your ${email} for complete registration! Thank you!`,
      payload: { token },
    });
  } catch (error) {
    next(error);
  }
};

const activateUserAccount = async (req, res, next) => {
  try {
    const token = req.body.token;
    console.log(token);
    if (!token) throw createError(404, "Token is not found!");

    try {
      const decoded = jwt.verify(token, jwtActivationKey);
      console.log(decoded);
      if (!decoded) throw createError(404, "User is not verified!");

      const userExist = await User.findOne({ email: decoded.email });
      if (userExist) {
        throw createError(409, "Email already exists! Please try another one.");
      }

      await User.create(decoded);

      return successResponse(res, {
        success: 201,
        message: "User was registered successfully!",
      });
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        next(createError(401, "Token is expired! Please try again."));
      } else if (error.name === "JsonWebTokenError") {
        next(createError(401, "Token is invalid! Please try again."));
      } else {
        throw error;
      }
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  getUserByID,
  deleteUserById,
  processRegister,
  activateUserAccount,
};
