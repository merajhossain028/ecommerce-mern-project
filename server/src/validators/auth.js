const { body } = require("express-validator");

//registration validation
const validateUserResgistration = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required!")
    .isLength({ min: 3, max: 31 })
    .withMessage("Name must be between 3 to 31 characters!"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required!")
    .isEmail()
    .withMessage("Invalid email address!"),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required!")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters!")
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{6,}$/, "i")
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter and one number!"
    ),
  body("address")
    .trim()
    .notEmpty()
    .withMessage("Address is required!")
    .isLength({ min: 3 })
    .withMessage("Address must be at least 3 characters!"),
  body("phone").trim().notEmpty().withMessage("Phone is required!"),
  body("image").optional().isString().withMessage("Image must be a string!"),
];

module.exports = { validateUserResgistration };
