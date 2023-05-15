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

  addInput(LV) {
    this.inputs.push(LV);
  }

  addOutput(LV) {
    this.outputs.push(LV);
  }

  addRule(rule) {
    this.rules.push(rule);
  }

  getPreciseOutput(inputValues) {
    let leftParts = getLeftParts(inputValues, this);
    let rightParts = [];

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

    for (let i = 0; i < this.outputs.length; i++) {
      let union = [];
      for (let k = 0; k < rightParts.length; k++) {
        union.push(rightParts[k][i]);
      }
      unionOfCorrectedTerms.push(new UnionOfTerms(union));
    }

    let results = [];

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

  while (newS < half_S) {
    currentStep += delta;
    newS += delta * unionOfTerms.valueAt(currentStep);
  }

  return currentStep;
}
