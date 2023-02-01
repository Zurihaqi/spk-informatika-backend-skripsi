const { body, param } = require("express-validator");

module.exports = {
  getById: () => [
    param("id").notEmpty().isNumeric().withMessage("Masukkan id yang valid"),
  ],
  create: () => [
    body("lettered_grade")
      .matches(/^[A-Za-z+-]/)
      .withMessage("Tidak dapat mengandung angka"),
    body("course_id").isNumeric().withMessage("Masukkan angka"),
  ],
  update: () => [
    param("id").notEmpty().isNumeric().withMessage("Masukkan id yang valid"),
    body("lettered_grade")
      .optional()
      .matches(/^[A-Za-z+-]/)
      .withMessage("Tidak dapat mengandung angka"),
    body("course_id").optional().isNumeric().withMessage("Masukkan angka"),
  ],
  delete: () => [
    param("id").notEmpty().isNumeric().withMessage("Masukkan id yang valid"),
  ],
};
