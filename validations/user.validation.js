const { body } = require("express-validator");

module.exports = {
  update: () => [
    body("name")
      .optional()
      .isString()
      .withMessage("Nama hanya dapat berupa huruf"),
    body("email")
      .optional()
      .normalizeEmail()
      .isEmail()
      .withMessage("Masukkan email yang valid"),
    body("student_id").optional().isNumeric().withMessage("Masukkan angka"),
  ],
};
