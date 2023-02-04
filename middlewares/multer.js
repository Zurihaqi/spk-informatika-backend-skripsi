const multer = require("multer");
const errors = require("../misc/errorHandlers");
const errorHandler = (error, req, res, next) => {
  if (error.code === "LIMIT_FILE_SIZE") {
    throw errors.FILE_SIZE;
  }
  next(error);
};

const mediaStorage = multer.diskStorage({
  filename: (req, file, cb) => {
    const fileType = file.mimetype.split("/")[1];
    const fileName = Date.now() + "-" + file.fieldname + `.${fileType}`;
    cb(null, fileName);
  },
});

const imageUpload = multer({
  storage: mediaStorage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/webp" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      return cb(null, true);
    }
    cb(null, false);
    return cb(
      new Error("Invalid image format. Allowed format: png, jpg, jpeg, webp")
    );
  },
  limits: {
    fileSize: 5242880,
  },
});

module.exports = {
  imageUpload,
  errorHandler,
};
