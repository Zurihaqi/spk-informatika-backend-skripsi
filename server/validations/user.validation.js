const { body } = require("express-validator");

module.exports = {
  update: () => [
    body("name").optional().isString().withMessage("name adalah string"),
    body("email")
      .optional()
      .normalizeEmail()
      .isEmail()
      .withMessage("email tidak valid"),
    body("student_id")
      .optional()
      .isNumeric()
      .withMessage("student_id adalah integer"),
  ],
  updatePassword: () => [
    body("password")
      .notEmpty()
      .withMessage("masukkan password")
      .isLength({ min: 6 })
      .withMessage("password harus memiliki minimal 6 huruf"),
  ],
};
