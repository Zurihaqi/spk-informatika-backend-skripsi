const router = require("express").Router();
const controller = require("../controllers/auth.controller");
const validation = require("../validations/auth.validation");
const validate = require("../middlewares/validation");

module.exports = {
  signIn: router.post(
    "/login",
    validation.signIn(),
    validate,
    controller.signIn
  ),
  signUp: router.post(
    "/register",
    validation.signUp(),
    validate,
    controller.signUp
  ),
};
