const { body, param } = require("express-validator");

module.exports = {
  getById: () => [
    param("id").notEmpty().isNumeric().withMessage("Masukkan id yang valid"),
  ],
  create: () => [
    body("course_name").isLength({ min: 3 }).withMessage("Minimal 3 huruf"),
    body("credit").isNumeric().withMessage("Masukkan angka"),
    body("grade_weight").isNumeric().withMessage("Masukkan angka"),
  ],
  update: () => [
    param("id").notEmpty().isNumeric().withMessage("Masukkan id yang valid"),
    body("course_name")
      .optional()
      .isLength({ min: 3 })
      .withMessage("Minimal 3 huruf"),
    body("credit").optional().isNumeric().withMessage("Masukkan angka"),
    body("grade_weight").optional().isNumeric().withMessage("Masukkan angka"),
  ],
  delete: () => [
    param("id").notEmpty().isNumeric().withMessage("Masukkan id yang valid"),
  ],
};
