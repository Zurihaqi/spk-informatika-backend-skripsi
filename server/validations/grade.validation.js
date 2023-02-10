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
    body("lettered_grade")
      .notEmpty()
      .withMessage("lettered_grade tidak boleh kosong")
      .isIn(["E", "D", "C-", "C", "C+", "B-", "B", "B+", "A-", "A"])
      .withMessage(
        "nilai lettered_grade adalah E, D, C-, C, C+, B-, B, B+, A-, A"
      ),
    body("course_id")
      .notEmpty()
      .withMessage("course_id tidak boleh kosong")
      .isNumeric()
      .withMessage("course_id adalah integer"),
  ],
  update: () => [
    param("id")
      .notEmpty()
      .withMessage("param id tidak boleh kosong")
      .isNumeric()
      .withMessage("param id adalah integer"),
    body("lettered_grade")
      .optional()
      .isIn(["E", "D", "C-", "C", "C+", "B-", "B", "B+", "A-", "A"])
      .withMessage(
        "nilai lettered_grade adalah E, D, C-, C, C+, B-, B, B+, A-, A"
      ),
    body("course_id")
      .optional()
      .isNumeric()
      .withMessage("course_id adalah integer"),
  ],
  delete: () => [
    param("id")
      .notEmpty()
      .withMessage("param id tidak boleh kosong")
      .isNumeric()
      .withMessage("param id adalah integer"),
  ],
};
