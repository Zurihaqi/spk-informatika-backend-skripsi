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
    body("course_code")
      .isString()
      .withMessage("course_code adalah string")
      .notEmpty()
      .withMessage("course_code tidak boleh kosong"),
    body("course_name")
      .isAlphanumeric("en-US", { ignore: " " })
      .withMessage("course_name adalah string")
      .isLength({ min: 3 })
      .withMessage("Nama mata kuliah harus memiliki minimal 3 huruf."),
    body("credit").isNumeric().withMessage("SKS hanya boleh mengandung angka."),
    body("semester")
      .isNumeric()
      .withMessage("Semester hanya boleh mengandung angka."),
  ],
  update: () => [
    param("id")
      .notEmpty()
      .withMessage("param id tidak boleh kosong")
      .isNumeric()
      .withMessage("param id adalah integer"),
    body("course_code")
      .optional()
      .isString()
      .withMessage("course_code adalah string"),
    body("course_name")
      .optional()
      .isAlphanumeric("en-US", { ignore: " " })
      .withMessage("course_name adalah string")
      .isLength({ min: 3 })
      .withMessage("course_name harus memiliki minimal 3 huruf"),
    body("credit").optional().isNumeric().withMessage("credit adalah integer"),
    body("semester")
      .optional()
      .isNumeric()
      .withMessage("semester adalah integer"),
    body("spec_id")
      .optional()
      .isNumeric()
      .withMessage("spec_id adalah integer"),
  ],
  delete: () => [
    param("id")
      .notEmpty()
      .withMessage("param id tidak boleh kosong")
      .isNumeric()
      .withMessage("param id adalah integer"),
  ],
};
