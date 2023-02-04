const error = require("../misc/errorHandlers");

module.exports = letterGrading = (grade, credit) => {
  switch (grade !== undefined) {
    case grade == "A":
      return { credit_grade: credit * (4.0).toFixed(2), numbered_grade: 4.0 };
    case grade == "A-":
      return { credit_grade: credit * (3.7).toFixed(2), numbered_grade: 3.7 };
    case grade == "B+":
      return { credit_grade: credit * (3.3).toFixed(2), numbered_grade: 3.3 };
    case grade == "B":
      return { credit_grade: credit * (3.0).toFixed(2), numbered_grade: 3.0 };
    case grade == "B-":
      return { credit_grade: credit * (2.7).toFixed(2), numbered_grade: 2.7 };
    case grade == "C+":
      return { credit_grade: credit * (2.3).toFixed(2), numbered_grade: 2.3 };
    case grade == "C":
      return { credit_grade: credit * (2.0).toFixed(2), numbered_grade: 2.0 };
    case grade == "C-":
      return { credit_grade: credit * (1.7).toFixed(2), numbered_grade: 1.7 };
    case grade == "D":
      return { credit_grade: credit * (1.0).toFixed(2), numbered_grade: 1.0 };
    case grade == "E":
      return { credit_grade: 0, numbered_grade: 0 };
    default:
      throw error.INVALID_GRADE;
  }
};
