const { validationResult } = require("express-validator");
const { errorResponse } = require("../controller/responseController");

const runValidation = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);
      return errorResponse(res, {
        statusCode: 422,
        message: errors.array()[0].msg,
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { runValidation };
