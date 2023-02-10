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
};
