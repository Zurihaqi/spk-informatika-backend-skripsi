const { body, param } = require("express-validator");

module.exports = {
  getById: () => [
    param("id")
      .notEmpty()
      .withMessage("param id tidak boleh kosong")
      .isNumeric()
      .withMessage("param id adalah integer"),
  ],
  create: () => [
    body("spec_name")
      .notEmpty()
      .withMessage("spec_name tidak boleh kosong")
      .isAlpha("en-US", { ignore: " " })
      .isLength({ min: 3 })
      .withMessage("spec_name adalah string"),
  ],
  update: () => [
    param("id")
      .notEmpty()
      .withMessage("param id tidak boleh kosong")
      .isNumeric()
      .withMessage("param id adalah integer"),
    body("spec_name")
      .optional()
      .isAlpha("en-US", { ignore: " " })
      .isLength({ min: 3 })
      .withMessage("spec_name adalah string"),
  ],
  delete: () => [
    param("id")
      .notEmpty()
      .withMessage("param id tidak boleh kosong")
      .isNumeric()
      .withMessage("param id adalah integer"),
  ],
};
