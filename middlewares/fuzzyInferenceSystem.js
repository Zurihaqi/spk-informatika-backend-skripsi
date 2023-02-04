const fuzzyis = require("fuzzyis");
const { LinguisticVariable, Term, Rule, FIS } = fuzzyis;

const system = new FIS("Sistem Pemilihan Peminatan");

const output = new LinguisticVariable("Output", [0.0, 1.0]);

const firstCourse = new LinguisticVariable("firstCourse", [0.0, 4.0]);
const secondCourse = new LinguisticVariable("secondCourse", [0.0, 4.0]);
const thirdCourse = new LinguisticVariable("thirdCourse", [0.0, 4.0]);

system.addOutput(output);
system.addInput(firstCourse);
system.addInput(secondCourse);
system.addInput(secondCourse);

firstCourse.addTerm(new Term("Sangat rendah", "gauss", [0.0, 2.2]));
firstCourse.addTerm(new Term("Rendah", "gauss", [1.9, 2.5]));
firstCourse.addTerm(new Term("Sedang", "gauss", [2.2, 2.8]));
firstCourse.addTerm(new Term("Tinggi", "gauss", [2.5, 3.1]));
firstCourse.addTerm(new Term("Sangat tinggi", "gauss", [2.8, 4.0]));

secondCourse.addTerm(new Term("Sangat rendah", "gauss", [0.0, 2.2]));
secondCourse.addTerm(new Term("Rendah", "gauss", [1.9, 2.5]));
secondCourse.addTerm(new Term("Sedang", "gauss", [2.2, 2.8]));
secondCourse.addTerm(new Term("Tinggi", "gauss", [2.5, 3.1]));
secondCourse.addTerm(new Term("Sangat tinggi", "gauss", [2.8, 4.0]));

thirdCourse.addTerm(new Term("Sangat rendah", "gauss", [0.0, 2.2]));
thirdCourse.addTerm(new Term("Rendah", "gauss", [1.9, 2.5]));
thirdCourse.addTerm(new Term("Sedang", "gauss", [2.2, 2.8]));
thirdCourse.addTerm(new Term("Tinggi", "gauss", [2.5, 3.1]));
thirdCourse.addTerm(new Term("Sangat tinggi", "gauss", [2.8, 4.0]));

output.addTerm(new Term("Direkomendasikan", "gauss", [0.4, 1.0]));
output.addTerm(new Term("Tidak direkomendasikan", "gauss", [0.0, 0.4]));

system.rules = [
  new Rule(["Rendah", "Rendah", "Rendah"], ["Tidak direkomendasikan"], "and"),
  new Rule(
    ["Sangat tinggi", "Sangat tinggi", "Sangat tinggi"],
    ["Direkomendasikan"],
    "and"
  ),
];

console.log(`Persentase: ${system.getPreciseOutput([1.0, 2.0, 4.0]) * 100}%`);
