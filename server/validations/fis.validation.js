const { query } = require("express-validator");

module.exports = {
  calculate: () => [
    query("spec")
      .notEmpty()
      .withMessage("query spec tidak boleh kosong")
      .isIn(["all", "software-dev", "data-science", "networking"])
      .withMessage(
        "pilihan query spec adalah all, software-dev, data-science, networking"
      ),
  ],
};
