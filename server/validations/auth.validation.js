const { body } = require("express-validator");

module.exports = {
  signIn: () => [
    body("email").notEmpty().withMessage("masukkan email/npm"),
    body("password").notEmpty().withMessage("masukkan password"),
  ],
  signUp: () => [
    body("name")
      .isAlpha("en-US", { ignore: " " })
      .withMessage("name adalah string tanpa angka atau simbol")
      .isLength({ min: 3 })
      .withMessage("name harus memiliki minimal 3 huruf"),
    body("email").normalizeEmail().isEmail().withMessage("masukkan email"),
    body("password")
      .notEmpty()
      .withMessage("masukkan password")
      .isLength({ min: 6 })
      .withMessage("password harus memiliki minimal 6 huruf"),
  ],
};
