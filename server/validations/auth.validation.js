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
      .isLength({ min: 3, max: 30 })
      .withMessage("Panjang nama adalah minimal 3 huruf maksimal 30 huruf."),
    body("email")
      .normalizeEmail()
      .isEmail()
      .withMessage("Masukan alamat email yang valid."),
    body("student_id")
      .isNumeric()
      .withMessage("NPM hanya boleh berupa angka.")
      .isLength({ max: 13 })
      .withMessage("Panjang maksimal NPM adalah 13 angka."),
    body("password")
      .notEmpty()
      .withMessage("Masukan kata sandi.")
      .isLength({ min: 6 })
      .withMessage("Kata sandi harus memiliki minimal 6 karakter."),
  ],
  adminSignUp: () => [
    body("name")
      .isAlpha("en-US", { ignore: " " })
      .withMessage("Nama tidak dapat mengandung angka atau simbol.")
      .isLength({ min: 3, max: 30 })
      .withMessage("Panjang nama adalah minimal 3 huruf maksimal 30 huruf."),
    body("email")
      .normalizeEmail()
      .isEmail()
      .withMessage("Masukan alamat email yang valid."),
    body("password")
      .notEmpty()
      .withMessage("Masukan kata sandi.")
      .isLength({ min: 6 })
      .withMessage("Kata sandi harus memiliki minimal 6 karakter."),
  ],
  forgotPass: () => [
    body("email")
      .normalizeEmail()
      .isEmail()
      .withMessage("Masukan alamat email yang valid."),
  ],
};
