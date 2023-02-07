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
      .withMessage("course_name harus memiliki minimal 3 huruf"),
    body("credit").isNumeric().withMessage("credit adalah integer"),
    body("semester").isNumeric().withMessage("semester adalah integer"),
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
  ],
  delete: () => [
    param("id")
      .notEmpty()
      .withMessage("param id tidak boleh kosong")
      .isNumeric()
      .withMessage("param id adalah integer"),
  ],
};
