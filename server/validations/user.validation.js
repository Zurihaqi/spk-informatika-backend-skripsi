const { body } = require("express-validator");

module.exports = {
  update: () => [
    body("name")
      .optional()
      .isAlpha("en-US", { ignore: " " })
      .withMessage("Nama tidak dapat mengandung angka atau simbol."),
    body("email")
      .optional()
      .normalizeEmail()
      .isEmail()
      .withMessage("Masukan alamat email yang valid."),
    body("student_id")
      .optional()
      .isInt()
      .withMessage("Nomor Pokok Mahasiswa hanya dapat mengandung angka."),
  ],
  updatePassword: () => [
    body("password")
      .notEmpty()
      .withMessage("masukkan password")
      .isLength({ min: 6 })
      .withMessage("password harus memiliki minimal 6 huruf"),
  ],
  delete: () => [body("password").notEmpty().withMessage("masukkan password")],
};
