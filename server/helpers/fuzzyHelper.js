const fuzzyis = require("fuzzyis");
const { LinguisticVariable, Term, Rule, FIS } = fuzzyis;

const system = new FIS("Fan Speed System");

const [matkul1, matkul2, matkul3] = [
  new LinguisticVariable("matkul1", [0, 4]),
  new LinguisticVariable("matkul2", [0, 4]),
  new LinguisticVariable("matkul3", [0, 4]),
];
const peminatan = new LinguisticVariable("peminatan", [0, 1]);

const inputTerms = [
  new Term("rendah", "triangle", [0, 0, 2.0]),
  new Term("sedang", "triangle", [2.0, 2.75, 3.5]),
  new Term("tinggi", "triangle", [3.5, 4.0, 4.0]),
];

const outputTerms = [
  new Term("tidak-disarankan", "triangle", [0, 0, 0.3]),
  new Term("disarankan", "triangle", [0, 0.3, 0.7]),
  new Term("sangat-disarankan", "triangle", [0.3, 0.7, 1]),
];

system.addInput(matkul1);
system.addInput(matkul2);
system.addInput(matkul3);
system.addOutput(peminatan);

inputTerms.forEach((e) => {
  matkul1.addTerm(e);
  matkul2.addTerm(e);
  matkul3.addTerm(e);
});

outputTerms.forEach((e) => {
  peminatan.addTerm(e);
});

// system.rules = [
//   new Rule(["sedang", null, "rendah"], ["tidak-disarankan"], "and"),
//   new Rule([null, null, "rendah"], ["tidak-disarankan"], "and"),
//   new Rule(["sedang", "sedang", null], ["disarankan"], "and"),
//   new Rule(["tinggi", null, "tinggi"], ["sangat-disarankan"], "and"),
//   new Rule([null, "rendah", "tinggi"], ["disarankan"], "and"),
// ];

// const inputs = [2.7, 2.4, 1.8];
// const result = system.getPreciseOutput(inputs)[0].toFixed(2);

// console.log("Persentase rekomendasi: " + result + "%");

module.exports = system;
