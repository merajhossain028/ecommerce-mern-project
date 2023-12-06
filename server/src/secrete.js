const dotenv = require("dotenv");
dotenv.config();

const serverPort = process.env.SERVER_PORT || 3002;
const mongodbUrl =
  process.env.MONGODB_ATLAS_URL || "mongodb://localhost:27017/ecommerce";
const defaultImagePath =
  process.env.DEFAULT_USER_IMAGE_PATH ||
  "server/public/images/users/default.jpg";
const jwtActivationKey = process.env.JWT_ACTIVATION_KEY || "asdafdsfdsfsdfasf";

const smtpUserName = process.env.SMTP_USERNAME || "";

const smtpPassword = process.env.SMTP_PASSWORD || "";
const clientURL = process.env.CLIENT_URL || "";
const uploadDir =
  process.env.UPLOAD_USER_IMG_DIRECTORY || "public/images/users";

module.exports = {
  serverPort,
  mongodbUrl,
  defaultImagePath,
  jwtActivationKey,
  smtpUserName,
  smtpPassword,
  clientURL,
  uploadDir,
};
