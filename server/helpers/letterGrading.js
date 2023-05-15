const error = require("../misc/errorHandlers");

module.exports = function letterGrading(grade, credit) {
  const gradeMapping = {
    A: { credit_grade: 4.0, numbered_grade: 4.0 },
    "A-": { credit_grade: 3.75, numbered_grade: 3.75 },
    "B+": { credit_grade: 3.25, numbered_grade: 3.25 },
    B: { credit_grade: 3.0, numbered_grade: 3.0 },
    "B-": { credit_grade: 2.75, numbered_grade: 2.75 },
    "C+": { credit_grade: 2.25, numbered_grade: 2.25 },
    C: { credit_grade: 2.0, numbered_grade: 2.0 },
    "C-": { credit_grade: 1.75, numbered_grade: 1.75 },
    D: { credit_grade: 1.0, numbered_grade: 1.0 },
    E: { credit_grade: 0.1, numbered_grade: 0.1 },
  };

  if (grade in gradeMapping) {
    const { credit_grade, numbered_grade } = gradeMapping[grade];
    return {
      credit_grade: (credit * credit_grade).toFixed(2),
      numbered_grade: numbered_grade,
    };
  } else {
    throw error.INVALID_GRADE;
  }
};
