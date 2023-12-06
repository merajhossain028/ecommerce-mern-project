const multer = require("multer");
const path = require("path");
const createError = require("http-errors");

const MAX_FILE_SIZE = Number(process.env.MAX_FILE_SIZE) || 1024 * 1024 * 2; // 2MB
const ALLOWED_FILE_TYPES = process.env.ALLOWED_FILE_TYPES || [
  "jpg",
  "jpeg",
  "png",
];
const UPLOAD_DIR = process.env.UPLOAD_FILE || "public/images/users";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    const extname = path.extname(file.originalname);
    cb(
      null,
      Date.now() + "-" + file.originalname.replace(extname, "") + extname
    );
  },
});

const fileFilter = (req, file, cb) => {
  const extname = path.extname(file.originalname);
  if (!ALLOWED_FILE_TYPES.includes(extname.substring(1))) {
    return cb(createError(400, "Only images are allowed!"));
  }
  cb(null, true);
};
const upload = multer({
  storage: storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter,
});

module.exports = upload;
