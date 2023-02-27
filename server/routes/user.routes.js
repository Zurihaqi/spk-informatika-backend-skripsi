const router = require("express").Router();
const validation = require("../validations/user.validation");
const validate = require("../middlewares/validation");
const multer = require("../middlewares/multer");
const cloudinaryUpload = require("../middlewares/cloudinary");
const controller = require("../controllers/user.controller");

router.get("/", controller.get);
router.patch(
  "/",
  multer.imageUpload.single("profile_pic"),
  multer.errorHandler,
  validation.update(),
  validate,
  cloudinaryUpload,
  controller.update
);
router.post("/delete", validation.delete(), validate, controller.delete);
router.patch(
  "/update-password",
  validation.updatePassword(),
  validate,
  controller.updatePassword
);

module.exports = router;
