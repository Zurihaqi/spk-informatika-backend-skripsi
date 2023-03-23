const error = require("../misc/errorHandlers");

module.exports = letterGrading = (grade, credit) => {
  switch (grade !== undefined) {
    case grade == "A":
      return { credit_grade: credit * (4.0).toFixed(2), numbered_grade: 4.0 };
    case grade == "A-":
      return { credit_grade: credit * (3.75).toFixed(2), numbered_grade: 3.75 };
    case grade == "B+":
      return { credit_grade: credit * (3.25).toFixed(2), numbered_grade: 3.25 };
    case grade == "B":
      return { credit_grade: credit * (3.0).toFixed(2), numbered_grade: 3.0 };
    case grade == "B-":
      return { credit_grade: credit * (2.75).toFixed(2), numbered_grade: 2.75 };
    case grade == "C+":
      return { credit_grade: credit * (2.25).toFixed(2), numbered_grade: 2.25 };
    case grade == "C":
      return { credit_grade: credit * (2.0).toFixed(2), numbered_grade: 2.0 };
    case grade == "C-":
      return { credit_grade: credit * (1.75).toFixed(2), numbered_grade: 1.75 };
    case grade == "D":
      return { credit_grade: credit * (1.0).toFixed(2), numbered_grade: 1.0 };
    case grade == "E":
      return { credit_grade: 0.1, numbered_grade: 0.1 };
    default:
      throw error.INVALID_GRADE;
  }
};
