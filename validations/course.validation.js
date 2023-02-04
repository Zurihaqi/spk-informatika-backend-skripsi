const { body, param } = require("express-validator");

module.exports = {
  getById: () => [
    param("id").notEmpty().isNumeric().withMessage("Masukkan id yang valid"),
  ],
  create: () => [
    body("course_code").notEmpty().withMessage("Tidak boleh kosong"),
    body("course_name")
      .isAlphanumeric("en-US", { ignore: " " })
      .isLength({ min: 3 })
      .withMessage("Minimal 3 huruf tanpa simbol"),
    body("credit").isNumeric().withMessage("Masukkan angka"),
    body("semester").isNumeric().withMessage("Masukkan angka"),
  ],
  update: () => [
    param("id").notEmpty().isNumeric().withMessage("Masukkan id yang valid"),
    body("course_name")
      .optional()
      .isAlphanumeric("en-US", { ignore: " " })
      .isLength({ min: 3 })
      .withMessage("Minimal 3 huruf tanpa simbol"),
    body("credit").optional().isNumeric().withMessage("Masukkan angka"),
    body("semester").optional().isNumeric().withMessage("Masukkan angka"),
  ],
  delete: () => [
    param("id").notEmpty().isNumeric().withMessage("Masukkan id yang valid"),
  ],
};
