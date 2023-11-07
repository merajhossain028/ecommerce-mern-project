const dotenv = require("dotenv")
dotenv.config();    

const serverPort = process.env.SERVER_PORT || 3002;
const mongodbUrl = process.env.MONGODB_ATLAS_URL || "mongodb://localhost:27017/ecommerce";
const defaultImagePath = process.env.DEFAULT_USER_IMAGE_PATH || "server/public/images/users/default.jpg";

module.exports = {  serverPort, mongodbUrl };