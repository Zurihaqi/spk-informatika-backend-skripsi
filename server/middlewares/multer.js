const multer = require("multer");
const errors = require("../misc/errorHandlers");
const errorHandler = (error, req, res, next) => {
  if (error.code === "LIMIT_FILE_SIZE") {
    throw errors.FILE_SIZE;
  }
  if (error.code === "LIMIT_FILE_COUNT") {
    throw errors.FILE_COUNT;
  }
  next(error);
};

const mediaStorage = multer.diskStorage({
  filename: (req, file, cb) => {
    const fileType = file.mimetype.split("/")[1];
    const fileName = Date.now() + "-" + file.fieldname + `.${fileType}`;
    if (file.fieldname === "profile_pic") req.body.profile_pic = true;
    cb(null, fileName);
  },
});

const imageUpload = multer({
  storage: mediaStorage,
  fileFilter: (req, file, cb) => {
    if (req.user.role === "Admin") {
      if (
        file.mimetype == "image/png" ||
        file.mimetype == "image/webp" ||
        file.mimetype == "image/jpg" ||
        file.mimetype == "image/jpeg" ||
        file.mimetype == "image/gif"
      ) {
        return cb(null, true);
      }
      cb(null, false);
      return cb(errors.INVALID_FORMAT_GIF);
    }
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/webp" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      return cb(null, true);
    }
    cb(null, false);
    return cb(errors.INVALID_FORMAT);
  },
  limits: {
    fileSize: 5242880,
    files: 1,
  },
});

module.exports = {
  imageUpload,
  errorHandler,
};
