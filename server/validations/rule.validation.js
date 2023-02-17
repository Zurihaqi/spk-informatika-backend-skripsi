const { body, param, query } = require("express-validator");

module.exports = {
  getAll: () => [
    query("spec_id")
      .optional()
      .isNumeric()
      .withMessage("spec_id adalah integer"),
  ],
  getById: () => [
    param("id")
      .notEmpty()
      .withMessage("param id tidak boleh kosong")
      .isNumeric()
      .withMessage("param id adalah integer"),
  ],
  create: () => [
    body("condition")
      .notEmpty()
      .withMessage("condition tidak boleh kosong")
      .isAlpha("en-US", { ignore: " " })
      .withMessage("condition adalah string")
      .isIn(["Rendah", "Sedang", "Tinggi"])
      .withMessage("nilai condition adalah Rendah, Sedang, Tinggi"),
    body("conclusion")
      .notEmpty()
      .withMessage("conclusion tidak boleh kosong")
      .isAlpha("en-US", { ignore: " " })
      .withMessage("condition adalah string")
      .isIn(["Direkomendasikan", "Tidak direkomendasikan"])
      .withMessage(
        "nilai conclusion adalah Direkomendasikan, Tidak direkomendasikan"
      ),
    body("connection")
      .notEmpty()
      .withMessage("connection tidak boleh kosong")
      .isAlpha("en-US", { ignore: " " })
      .withMessage("connection adalah string")
      .isIn(["and", "or"])
      .withMessage("nilai conclusion adalah and atau or"),
    body("spec_id").isNumeric().withMessage("spec_id adalah integer"),
  ],
  update: () => [
    param("id")
      .notEmpty()
      .withMessage("param id tidak boleh kosong")
      .isNumeric()
      .withMessage("param id adalah integer"),
    body("condition")
      .optional()
      .isAlpha("en-US", { ignore: " " })
      .withMessage("condition adalah string")
      .isIn(["Rendah", "Sedang", "Tinggi"])
      .withMessage("nilai condition adalah Rendah, Sedang, Tinggi"),
    body("conclusion")
      .optional()
      .isAlpha("en-US", { ignore: " " })
      .withMessage("condition adalah string")
      .isIn(["Direkomendasikan", "Tidak direkomendasikan"])
      .withMessage(
        "nilai conclusion adalah Direkomendasikan, Tidak direkomendasikan"
      ),
    body("connection")
      .optional()
      .isAlpha("en-US", { ignore: " " })
      .withMessage("connection adalah string")
      .isIn(["and", "or"])
      .withMessage("nilai conclusion adalah and atau or"),
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
