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
const forgotPass = router.post(
  "/forgot-pass",
  validation.forgotPass(),
  validate,
  controller.forgotPass
);
const forgotPassValidate = router.post(
  "/forgot-pass/validate",
  controller.forgotPassValidate
);

module.exports = {
  signIn,
  signUp,
  adminSignUp,
  verifyReCaptcha,
  forgotPass,
  forgotPassValidate,
};
