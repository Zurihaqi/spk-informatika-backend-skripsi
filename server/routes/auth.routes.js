const router = require("express").Router();
const controller = require("../controllers/auth.controller");
const validation = require("../validations/auth.validation");
const validate = require("../middlewares/validation");

const signIn = router.post(
  "/login",
  validation.signIn(),
  validate,
  controller.signIn
);
const signUp = router.post(
  "/register",
  validation.signUp(),
  validate,
  controller.signUp
);
const adminSignUp = router.post(
  "/admin-register",
  validation.adminSignUp(),
  validate,
  controller.adminSignUp
);
const verifyReCaptcha = router.post("/verify", controller.verifyCaptcha);

module.exports = {
  signIn,
  signUp,
  adminSignUp,
  verifyReCaptcha,
};
