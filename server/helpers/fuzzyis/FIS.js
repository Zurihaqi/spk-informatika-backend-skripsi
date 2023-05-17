const CorrectedTerm = require("./CorrectedTerm");
const UnionOfTerms = require("./UnionOfTerms");
const helpers = require("./helpers");

class FIS {
  constructor(name = "Unnamed system", inputs = [], outputs = [], rules = []) {
    this.name = name;
    this.inputs = inputs;
    this.outputs = outputs;
    this.rules = rules;
  }

  // Menambahkan variabel linguistik masukan (input)
  addInput(LV) {
    this.inputs.push(LV);
  }

  // Menambahkan variabel linguistik keluaran (output)
  addOutput(LV) {
    this.outputs.push(LV);
  }

  // Menambahkan aturan ke dalam sistem
  addRule(rule) {
    this.rules.push(rule);
  }

  // Mendapatkan keluaran yang tepat berdasarkan nilai-nilai masukan
  getPreciseOutput(inputValues) {
    let leftParts = getLeftParts(inputValues, this);
    let rightParts = [];

    // Menghitung derajat keyakinan untuk setiap aturan
    for (let i = 0; i < this.rules.length; i++) {
      let rule = this.rules[i];
      rule.beliefDegree =
        rule.connection === "and"
          ? helpers.getMin(leftParts[i])
          : helpers.getMax(leftParts[i]);
      rule.beliefDegree *= rule.weight;

      rightParts.push([]);
      for (let j = 0; j < rule.conclusions.length; j++) {
        let term = this.outputs[j].findTerm(rule.conclusions[j]);
        rightParts[i].push(new CorrectedTerm(term, rule.beliefDegree));
      }
    }

    let unionOfCorrectedTerms = [];

    // Menggabungkan himpunan yang dikoreksi untuk setiap variabel keluaran
    for (let i = 0; i < this.outputs.length; i++) {
      let union = [];
      for (let k = 0; k < rightParts.length; k++) {
        union.push(rightParts[k][i]);
      }
      unionOfCorrectedTerms.push(new UnionOfTerms(union));
    }

    let results = [];

    // Menghitung pusat massa (centroid) untuk setiap variabel keluaran
    for (let i = 0; i < this.outputs.length; i++) {
      let result = getMassCenter(
        unionOfCorrectedTerms[i],
        this.outputs[i].range,
        100
      );
      results.push(result);
    }

    return results;
  }
}

module.exports = FIS;

// Mendapatkan himpunan bagian kiri (leftParts) berdasarkan nilai-nilai masukan
function getLeftParts(inputValues, system) {
  let leftParts = [];
  let inputsAmount = system.inputs.length;

  for (let i = 0; i < system.rules.length; i++) {
    leftParts.push([]);
    for (let j = 0; j < inputsAmount; j++) {
      if (system.rules[i].conditions[j]) {
        let term = system.inputs[j].findTerm(system.rules[i].conditions[j]);
        leftParts[i].push(term.valueAt(inputValues[j]));
      } else {
        leftParts[i].push(null);
      }
    }
  }

  return leftParts;
}

// Menghitung pusat massa (centroid) dari himpunan yang digabungkan
function getMassCenter(unionOfTerms, range, points) {
  let delta = (range[1] - range[0]) / (points || 100);
  let S = 0;
  let currentStep = range[0];

  while (currentStep < range[1]) {
    currentStep += delta;
    S += delta * unionOfTerms.valueAt(currentStep);
  }

  currentStep = range[0];
  let newS = 0;
  let half_S = S / 2;

  // Mencari nilai tengah (pusat massa) dengan pendekatan
  while (newS < half_S) {
    currentStep += delta;
    newS += delta * unionOfTerms.valueAt(currentStep);
  }

  return currentStep;
}
