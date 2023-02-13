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
    if (file.fieldname === "profile_pic") req.body.profile_pic = true;
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
    return cb(new Error("Format yang diperbolehkan: png, jpg, jpeg, webp"));
  },
  limits: {
    fileSize: 5242880,
  },
});

module.exports = {
  imageUpload,
  errorHandler,
};
