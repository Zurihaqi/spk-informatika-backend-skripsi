const { Rule, Grades } = require("../db/models/");
const error = require("../misc/errorHandlers");
const system = require("../helpers/fuzzyHelper");
const Rules = require("fuzzyis").Rule;

module.exports = [
  (calculate = () => {
    system.rules = [
      new Rules(["sedang", null, "rendah"], ["tidak-disarankan"], "and"),
      new Rules([null, null, "rendah"], ["tidak-disarankan"], "and"),
      new Rules(["sedang", "sedang", null], ["disarankan"], "and"),
      new Rules(["tinggi", null, "tinggi"], ["sangat-disarankan"], "and"),
      new Rules([null, "rendah", "tinggi"], ["disarankan"], "and"),
    ];

    const inputs = [4.0, 2.4, 1.8];
    const result = system.getPreciseOutput(inputs)[0].toFixed(2);

    console.log(result);
  }),
];

calculate();
