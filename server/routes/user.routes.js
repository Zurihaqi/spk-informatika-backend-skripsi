const router = require("express").Router();
const validation = require("../validations/user.validation");
const validate = require("../middlewares/validation");
const multer = require("../middlewares/multer");
const cloudinaryUpload = require("../middlewares/cloudinary");
const controller = require("../controllers/user.controller");
const { isAdmin } = require("../middlewares/passport");

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
router.get(
  "/get-all",
  isAdmin,
  validation.getAll(),
  validate,
  controller.getAllUser
);
router.patch(
  "/add-admin/:id",
  isAdmin,
  validation.addAdmin(),
  validate,
  controller.addAdmin
);
router.patch(
  "/remove-admin/:id",
  isAdmin,
  validation.removeAdmin(),
  validate,
  controller.removeAdmin
);
router.patch(
  "/approve-admin/:id",
  isAdmin,
  validation.approveAdmin(),
  validate,
  controller.approveAdmin
);

module.exports = router;
