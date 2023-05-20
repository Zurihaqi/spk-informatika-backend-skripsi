const multer = require("multer");
const errors = require("../misc/errorHandlers");

const imageStorage = multer.diskStorage({
  filename: (req, file, cb) => {
    const fileType = file.mimetype.split("/")[1];
    const fileName = `${Date.now()}-${file.fieldname}.${fileType}`;
    if (file.fieldname === "profile_pic") req.body.profile_pic = true;
    cb(null, fileName);
  },
});

const imageUpload = multer({
  storage: imageStorage,
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      "image/png",
      "image/webp",
      "image/jpg",
      "image/jpeg",
    ];
    const isAdmin = req.user.role === "Admin";
    const isGifFile = file.mimetype === "image/gif";

    if (isAdmin || (isGifFile && !isAdmin)) {
      return cb(null, true);
    } else if (allowedMimeTypes.includes(file.mimetype)) {
      return cb(null, true);
    } else {
      return cb(errors.INVALID_FORMAT);
    }
  },
  limits: {
    fileSize: 5242880, // 5MB
    files: 1,
  },
});

const errorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json(errors.FILE_SIZE);
    }
    if (err.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json(errors.FILE_COUNT);
    }
  }
  next(err);
};

module.exports = {
  imageUpload,
  errorHandler,
};
