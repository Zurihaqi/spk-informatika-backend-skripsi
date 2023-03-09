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
router.post("/message", controller.sendMessage);
router.get("/get-all", validation.getAll(), validate, controller.getAllUser);
router.patch(
  "/add-admin/:id",
  validation.addAdmin(),
  validate,
  controller.addAdmin
);

module.exports = router;
