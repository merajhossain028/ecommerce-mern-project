const createError = require("http-errors");
const User = require("../models/userModels");

const getUsers = async (req, res, next) => {
  try {
    const search = req.query.search || "";
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 1;

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

    const users = await User.find(filter, options).limit(limit).skip(limit * (page - 1));

    const count = await User.find(filter).countDocuments();

    if (!users) { 
      return next(createError(404, "Users were not found!"));
    }
    res.status(200).send({
      message: "Users were returned!",
      users,
      pagination: {
        totalPage: Math.ceil(count / limit),
        currentPage: page,
        previousPage: page - 1 > 0 ? page - 1 : null,
        nextPage: page + 1 <= Math.ceil(count / limit) ? page + 1 : null,
      }
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { getUsers };
