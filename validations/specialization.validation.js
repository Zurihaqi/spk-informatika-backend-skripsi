const { body, param } = require("express-validator");

module.exports = {
  getById: () => [
    param("id").notEmpty().isNumeric().withMessage("Masukkan id yang valid"),
  ],
  create: () => [
    body("spec_name")
      .isAlpha("en-US", { ignore: " " })
      .isLength({ min: 3 })
      .withMessage("Minimal 3 huruf tanpa simbol atau angka"),
  ],
  update: () => [
    param("id").notEmpty().isNumeric().withMessage("Masukkan id yang valid"),
    body("spec_name")
      .optional()
      .isAlpha("en-US", { ignore: " " })
      .isLength({ min: 3 })
      .withMessage("Minimal 3 huruf tanpa simbol atau angka"),
  ],
  delete: () => [
    param("id").notEmpty().isNumeric().withMessage("Masukkan id yang valid"),
  ],
};
