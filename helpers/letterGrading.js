const error = require("../misc/errorHandlers");

module.exports = letterGrading = (grade, credit) => {
  console.log(credit);
  switch (grade !== undefined) {
    case grade == "A":
      return (4.0 * credit).toFixed(2);
    case grade == "A-":
      return (3.7 * credit).toFixed(2);
    case grade == "B+":
      return (3.3 * credit).toFixed(2);
    case grade == "B":
      return (3.0 * credit).toFixed(2);
    case grade == "B-":
      return (2.7 * credit).toFixed(2);
    case grade == "C+":
      return (2.3 * credit).toFixed(2);
    case grade == "C":
      return (2.0 * credit).toFixed(2);
    case grade == "C-":
      return (1.7 * credit).toFixed(2);
    case grade == "D":
      return (1.0 * credit).toFixed(2);
    case grade == "E":
      return 0;
    default:
      throw error.INVALID_GRADE;
  }
};
