const { Rule, Grade, Course } = require("../db/models/");
const fuzzyis = require("fuzzyis");
const { LinguisticVariable, Term, FIS } = fuzzyis;
const Rules = require("fuzzyis").Rule;
const error = require("../misc/errorHandlers");

module.exports = {
  calculate: async (req, res, next) => {
    try {
      const { spec } = req.query;

      //Mengambil data matkul, rule, dan nilai dari database
      const courses = await Course.findAll({ raw: true });
      const ruleSets = await Rule.findAll({ raw: true });
      const grades = await Grade.findAll({ raw: true });

      //Mendeklarasi Fuzzy Inference System untuk setiap peminatan
      const dataSci = new FIS("SPK Data Science");
      const softDev = new FIS("SPK Software Development");
      const networking = new FIS("SPK Networking");

      //Memisahkan data matkul dari setiap peminatan
      let softDevCourses = [];
      let dataSciCourses = [];
      let networkCourses = [];

      let result = {};

      //Membuat variabel masukan linguistik berdasarkan nama matkul
      courses.forEach((e) => {
        e.spec_id === 1
          ? softDevCourses.push(
              new LinguisticVariable(e.course_name, [0.0, 4.0])
            )
          : e.spec_id === 2
          ? dataSciCourses.push(
              new LinguisticVariable(e.course_name, [0.0, 4.0])
            )
          : e.spec_id === 3
          ? networkCourses.push(
              new LinguisticVariable(e.course_name, [0.0, 4.0])
            )
          : false;
      });

      //Membuat variabel linguistik keluaran
      const output = new LinguisticVariable("rekomendasi", [0, 1]);

      //Himpunan fuzzy untuk variabel masukan
      const inputTerms = [
        new Term("rendah", "triangle", [0.0, 0.0, 2.0]),
        new Term("sedang", "triangle", [0.0, 2.0, 4.0]),
        new Term("tinggi", "triangle", [2.0, 4.0, 4.0]),
      ];

      //Himpunan fuzzy untuk variabel keluaran
      const outputTerms = [
        new Term("tidak-disarankan", "triangle", [0, 0, 0.5]),
        new Term("disarankan", "triangle", [0.5, 1, 1]),
      ];

      outputTerms.forEach((e) => {
        output.addTerm(e);
      });

      softDev.addOutput(output);
      dataSci.addOutput(output);
      networking.addOutput(output);

      //Menghitung crisp output untuk peminatan software development
      if (spec === "software-dev" || spec === "all") {
        for (let i = 0; i < softDevCourses.length; i++) {
          inputTerms.forEach((terms) => {
            softDevCourses[i].addTerm(terms);
          });
          softDev.addInput(softDevCourses[i]);
        }

        const softDevRules = ruleSets.filter((e) => {
          return e.spec_id === 1;
        });
        if (!softDevRules) throw error.RULE_NOT_FOUND;
        softDevRules.forEach((e) => {
          softDev.rules.push(
            new Rules(e.condition, e.conclusion, e.connection)
          );
        });

        let softDevGrades = [];
        courses.forEach((e) => {
          if (e.spec_id === 1) {
            grades.forEach((o) => {
              if (o.course_id === e.id && o.user_id === req.user.id)
                return softDevGrades.push(o.numbered_grade);
            });
          }
        });

        if (softDevGrades.length !== softDevCourses.length)
          throw error.GRADE_NOT_FOUND;
        result.software_development =
          +softDev.getPreciseOutput(softDevGrades)[0];
      }

      //Menghitung crisp output untuk peminatan data science
      if (spec === "data-science" || spec === "all") {
        for (let i = 0; i < dataSciCourses.length; i++) {
          inputTerms.forEach((terms) => {
            dataSciCourses[i].addTerm(terms);
          });
          dataSci.addInput(dataSciCourses[i]);
        }

        const dataSciRules = ruleSets.filter((e) => {
          return e.spec_id === 2;
        });
        if (!dataSciRules) throw error.RULE_NOT_FOUND;
        dataSciRules.forEach((e) => {
          dataSci.rules.push(
            new Rules(e.condition, e.conclusion, e.connection)
          );
        });

        let dataSciGrades = [];
        courses.forEach((e) => {
          if (e.spec_id === 2) {
            grades.forEach((o) => {
              if (o.course_id === e.id && o.user_id === req.user.id)
                return dataSciGrades.push(o.numbered_grade);
            });
          }
        });

        if (dataSciGrades.length !== dataSciCourses.length)
          throw error.GRADE_NOT_FOUND;
        result.data_science = +dataSci.getPreciseOutput(dataSciGrades)[0];
      }

      //Menghitung crisp output untuk peminatan networking
      if (spec === "networking" || spec === "all") {
        for (let i = 0; i < networkCourses.length; i++) {
          inputTerms.forEach((terms) => {
            networkCourses[i].addTerm(terms);
          });
          networking.addInput(networkCourses[i]);
        }

        const networkingRules = ruleSets.filter((e) => {
          return e.spec_id === 3;
        });
        if (!networkingRules) throw error.RULE_NOT_FOUND;
        networkingRules.forEach((e) => {
          networking.rules.push(
            new Rules(e.condition, e.conclusion, e.connection)
          );
        });

        let networkingGrades = [];
        courses.forEach((e) => {
          if (e.spec_id === 3) {
            grades.forEach((o) => {
              if (o.course_id === e.id && o.user_id === req.user.id)
                return networkingGrades.push(o.numbered_grade);
            });
          }
        });

        if (networkingGrades.length !== networkCourses.length)
          throw error.GRADE_NOT_FOUND;
        result.networking = +networking.getPreciseOutput(networkingGrades)[0];
      }

      if (result) {
        if (
          result.software_development === 0 ||
          result.data_science === 0 ||
          result.networking === 0
        )
          throw error.FIS_ERROR;
        if (
          result.software_development &&
          result.data_science &&
          result.networking
        ) {
          const sum =
            result.software_development +
            result.data_science +
            result.networking;

          result.softDevPercentage = Math.round(
            (result.software_development / sum) * 100
          );
          result.dataSciPercentage = Math.round(
            (result.data_science / sum) * 100
          );
          result.networkingPercentage = Math.round(
            (result.networking / sum) * 100
          );
        }
        return res.status(201).json({
          status: "Success",
          result: result,
        });
      }
    } catch (err) {
      next(err);
    }
  },
};
