const router = require("express").Router();
const validation = require("../validations/user.validation");
const validate = require("../middlewares/validation");
const multer = require("../middlewares/multer");
const cloudinaryUpload = require("../middlewares/cloudinary");
const controller = require("../controllers/user.controller");

router.get("/", controller.get);
router.patch(
  "/",
  validation.update(),
  validate,
  multer.imageUpload.single("profile_pic"),
  multer.errorHandler,
  cloudinaryUpload,
  controller.update
);
router.delete("/", controller.delete);
router.patch(
  "/update-password",
  validation.updatePassword(),
  validate,
  controller.updatePassword
);

module.exports = router;
