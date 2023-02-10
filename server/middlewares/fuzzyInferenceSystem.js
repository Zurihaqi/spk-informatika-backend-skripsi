const fuzzy = require("javascript-fuzzylogic");
const { LinguisticVariable, FuzzySet, FuzzyInferenceSystem } = fuzzy;

const fuzzySystem = (rulesCount, rules, inputs) => {
  const gradeSangatRendah = new FuzzySet("Sangat Rendah", [0.0, 2.2]);
  const gradeRendah = new FuzzySet("Rendah", [1.9, 2.5]);
  const gradeSedang = new FuzzySet("Sedang", [2.2, 2.8]);
  const gradeTinggi = new FuzzySet("Tinggi", [2.5, 3.1]);
  const gradeSangatTinggi = new FuzzySet("Sangat Tinggi", [2.8, 4.0]);
  const outputRecommend = new FuzzySet("Direkomendasikan", [0.4, 1.0]);
  const outputNotRecommend = new FuzzySet("Tidak Direkomendasikan", [0.0, 0.4]);

  const firstGradeVariable = new LinguisticVariable("First Grade")
    .addSet(gradeSangatRendah)
    .addSet(gradeRendah)
    .addSet(gradeSedang)
    .addSet(gradeTinggi)
    .addSet(gradeSangatTinggi);

  const secondGradeVariable = new LinguisticVariable("Second Grade")
    .addSet(gradeSangatRendah)
    .addSet(gradeRendah)
    .addSet(gradeSedang)
    .addSet(gradeTinggi)
    .addSet(gradeSangatTinggi);

  const thirdGradeVariable = new LinguisticVariable("Third Grade")
    .addSet(gradeSangatRendah)
    .addSet(gradeRendah)
    .addSet(gradeSedang)
    .addSet(gradeTinggi)
    .addSet(gradeSangatTinggi);

  const outputVariable = new LinguisticVariable("Output")
    .addSet(outputRecommend)
    .addSet(outputNotRecommend);

  const SPKFIS = new FuzzyInferenceSystem("SPK")
    .addInput(firstGradeVariable)
    .addInput(secondGradeVariable)
    .addInput(thirdGradeVariable)
    .addOutput(outputVariable);

  SPKFIS.addRule();

  rules = [];
  let grades = [];

  for (let i = 0; i < rulesCount; i++) {
    system.rules.push(
      new Rule(rules[i].condition, rules[i].conclusion, rules[i].connection)
    );
  }

  for (let i = 0; i <= 2; i++) {
    grades.push(inputs[i].numbered_grade);
  }

  return result;
};

module.exports = fuzzySystem;
