const { body } = require("express-validator");

module.exports = {
  signIn: () => [
    body("email").notEmpty().withMessage("masukkan email/npm"),
    body("password").notEmpty().withMessage("masukkan password"),
  ],
  signUp: () => [
    body("name")
      .isAlpha("en-US", { ignore: " " })
      .withMessage("Nama tidak dapat mengandung angka atau simbol.")
      .isLength({ min: 3 })
      .withMessage("Nama harus memiliki minimal 3 huruf."),
    body("email")
      .normalizeEmail()
      .isEmail()
      .withMessage("Masukan alamat email yang valid."),
    body("password")
      .notEmpty()
      .withMessage("Masukan kata sandi.")
      .isLength({ min: 6 })
      .withMessage("Kata sandi harus memiliki minimal 6 huruf."),
  ],
};
