const { body } = require("express-validator");

module.exports = {
  signIn: () => [
    body("email")
      .notEmpty()
      .withMessage("Masukkan email")
      .normalizeEmail()
      .isEmail(),
    body("password").notEmpty().withMessage("Masukkan password"),
  ],
  signUp: () => [
    body("name")
      .isAlpha("en-US", { ignore: " " })
      .withMessage("Nama tidak boleh mengandung angka atau simbol")
      .isLength({ min: 3 })
      .withMessage("Nama harus memiliki minimal 3 karakter"),
    body("email").normalizeEmail().isEmail().withMessage("Masukkan email"),
    body("password")
      .notEmpty()
      .withMessage("Masukkan password")
      .isLength({ min: 6 })
      .withMessage("Password harus memiliki minimal 6 karakter"),
  ],
};
