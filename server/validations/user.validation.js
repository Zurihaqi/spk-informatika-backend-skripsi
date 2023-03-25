const { body, param, query } = require("express-validator");

module.exports = {
  getAll: () => [
    query("name")
      .optional()
      .isAlpha("en-US", { ignore: " " })
      .withMessage("query name hanya dapat mengandung huruf."),
  ],
  update: () => [
    body("name")
      .optional()
      .isAlpha("en-US", { ignore: " " })
      .withMessage("Nama tidak dapat mengandung angka atau simbol.")
      .isLength({ min: 3, max: 15 })
      .withMessage("Panjang nama adalah minimal 3 huruf maksimal 15 huruf."),
    body("email")
      .optional()
      .normalizeEmail()
      .isEmail()
      .withMessage("Masukan alamat email yang valid."),
    body("student_id")
      .optional()
      .isInt()
      .withMessage("Nomor Pokok Mahasiswa hanya dapat mengandung angka.")
      .isLength({ max: 13 })
      .withMessage("Panjang maksimal NPM adalah 13 angka."),
  ],
  updatePassword: () => [
    body("password")
      .notEmpty()
      .withMessage("masukkan password")
      .isLength({ min: 6 })
      .withMessage("password harus memiliki minimal 6 karakter"),
  ],
  delete: () => [body("password").notEmpty().withMessage("masukkan password")],
  addAdmin: () => [
    param("id").isNumeric().withMessage("param id adalah integer"),
  ],
  removeAdmin: () => [
    param("id").isNumeric().withMessage("param id adalah integer"),
  ],
};
