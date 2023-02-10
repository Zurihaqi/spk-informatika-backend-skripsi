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
const signOut = router.post("/logout", controller.signOut);

const success = router.get("/successjson", function (req, res) {
  res.status(200).json({
    status: "Success",
    message: "Login berhasil",
  });
});

const failure = router.get("/failurejson", (req, res) => {
  res.status(400).json({
    status: "Error",
  });
});

module.exports = {
  signIn,
  signUp,
  signOut,
  success,
  failure,
};
