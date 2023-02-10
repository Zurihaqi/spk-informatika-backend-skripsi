const { query } = require("express-validator");

module.exports = {
  getAll: () => [
    query("isValid")
      .optional()
      .isIn(["true", "false"])
      .withMessage("isValid bernilai 'true' atau 'false'"),
  ],
};
