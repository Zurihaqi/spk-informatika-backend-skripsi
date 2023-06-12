const { Rule, Grade, Course, Recommendation } = require("../db/models/");
const Op = require("sequelize").Op;
const fuzzyis = require("../helpers/fuzzyis/");
const { LinguisticVariable, Term, FIS } = fuzzyis;
const Rules = fuzzyis.Rule;
const error = require("../misc/errorHandlers");

module.exports = {
  calculate: async (req, res, next) => {
    try {
      const { spec } = req.query;

      //Mengambil data mata kuliah, aturan fuzzy, dan nilai mahasiswa dari database
      const [courses, ruleSets, grades] = await Promise.all([
        Course.findAll({ raw: true }),
        Rule.findAll({ raw: true }),
        Grade.findAll({ raw: true }),
      ]);

      //Membuat map untuk setiap Sistem Inferensi Fuzzy pada masing-masing peminatan
      const fisMap = new Map();
      fisMap.set("software-dev", new FIS("SPK Software Development"));
      fisMap.set("data-science", new FIS("SPK Data Science"));
      fisMap.set("networking", new FIS("SPK Networking"));

      //Pembuatan variabel linguistik
      const linguisticVariables = {
        "software-dev": [],
        "data-science": [],
        networking: [],
      };

      //Pembuatan variabel linguistik output (keluaran berupa rekomendasi)
      const output = new LinguisticVariable("rekomendasi", [0, 1]);

      //Memodelkan variabel masukan menggunakan representasi segitiga
      const inputTerms = [
        new Term("rendah", "triangle", [0.0, 1.0, 2.0]),
        new Term("sedang", "triangle", [1.5, 2.5, 3.5]),
        new Term("tinggi", "triangle", [3.0, 4.0, 4.0]),
      ];

      //Memodelkan variabel keluaran menggunakan representasi segitiga
      const outputTerms = [
        new Term("tidak-disarankan", "triangle", [0, 0, 0.5]),
        new Term("disarankan", "triangle", [0.5, 1, 1]),
      ];

      outputTerms.forEach((e) => {
        output.addTerm(e);
      });

      for (const fis of fisMap.values()) {
        fis.addOutput(output);
      }

      const result = {};

      if (spec === "software-dev" || spec === "all") {
        const softDev = fisMap.get("software-dev");

        //Memilah mata kuliah peminatan software development
        courses.forEach((e) => {
          if (e.spec_id === 1) {
            linguisticVariables["software-dev"].push(
              new LinguisticVariable(e.course_name, [0.0, 4.0])
            );
          }
        });

        for (const linguisticVariable of linguisticVariables["software-dev"]) {
          inputTerms.forEach((term) => {
            linguisticVariable.addTerm(term);
          });
          softDev.addInput(linguisticVariable);
        }

        //Memilah aturan fuzzy peminatan software development
        const softDevRules = ruleSets.filter((e) => e.spec_id === 1);
        if (!softDevRules.length) throw error.RULE_NOT_FOUND;
        softDevRules.forEach((e) => {
          softDev.rules.push(
            new Rules(e.condition, e.conclusion, e.connection)
          );
        });

        //Memilah nilai mata kuliah peminatan software development
        const softDevGrades = grades
          .filter((o) => {
            const course = courses.find((c) => c.id === o.course_id);
            return course && course.spec_id === 1 && o.user_id === req.user.id;
          })
          .map((o) => o.numbered_grade);

        //Menghitung keluaran crisp untuk peminatan software development jika nilai valid
        if (softDevGrades.length !== linguisticVariables["software-dev"].length)
          throw error.GRADE_NOT_FOUND;
        result.software_development = +softDev
          .getPreciseOutput(softDevGrades)[0]
          .toFixed(2);
      }

      if (spec === "data-science" || spec === "all") {
        const dataSci = fisMap.get("data-science");

        //Memilah mata kuliah untuk peminatan data sains
        courses.forEach((e) => {
          if (e.spec_id === 2) {
            linguisticVariables["data-science"].push(
              new LinguisticVariable(e.course_name, [0.0, 4.0])
            );
          }
        });

        for (const linguisticVariable of linguisticVariables["data-science"]) {
          inputTerms.forEach((term) => {
            linguisticVariable.addTerm(term);
          });
          dataSci.addInput(linguisticVariable);
        }

        //Memilah aturan fuzzy peminatan data sains
        const dataSciRules = ruleSets.filter((e) => e.spec_id === 2);
        if (!dataSciRules.length) throw error.RULE_NOT_FOUND;
        dataSciRules.forEach((e) => {
          dataSci.rules.push(
            new Rules(e.condition, e.conclusion, e.connection)
          );
        });

        //Memilah nilai mata kuliah peminatan data sains
        const dataSciGrades = grades
          .filter((o) => {
            const course = courses.find((c) => c.id === o.course_id);
            return course && course.spec_id === 2 && o.user_id === req.user.id;
          })
          .map((o) => o.numbered_grade);

        //Menghitung nilai keluaran crisp peminatan data sains
        if (dataSciGrades.length !== linguisticVariables["data-science"].length)
          throw error.GRADE_NOT_FOUND;
        result.data_science = +dataSci
          .getPreciseOutput(dataSciGrades)[0]
          .toFixed(2);
      }

      if (spec === "networking" || spec === "all") {
        const networking = fisMap.get("networking");

        //Memilah mata kuliah peminatan jaringan
        courses.forEach((e) => {
          if (e.spec_id === 3) {
            linguisticVariables["networking"].push(
              new LinguisticVariable(e.course_name, [0.0, 4.0])
            );
          }
        });

        for (const linguisticVariable of linguisticVariables["networking"]) {
          inputTerms.forEach((term) => {
            linguisticVariable.addTerm(term);
          });
          networking.addInput(linguisticVariable);
        }

        //Memilah aturan fuzzy peminatan jaringan
        const networkingRules = ruleSets.filter((e) => e.spec_id === 3);
        if (!networkingRules.length) throw error.RULE_NOT_FOUND;
        networkingRules.forEach((e) => {
          networking.rules.push(
            new Rules(e.condition, e.conclusion, e.connection)
          );
        });

        //Memilah nilai mata kuliah peminatan jaringan
        const networkingGrades = grades
          .filter((o) => {
            const course = courses.find((c) => c.id === o.course_id);
            return course && course.spec_id === 3 && o.user_id === req.user.id;
          })
          .map((o) => o.numbered_grade);

        //Menghitung nilai keluaran crisp peminatan jaringan
        if (
          networkingGrades.length !== linguisticVariables["networking"].length
        )
          throw error.GRADE_NOT_FOUND;
        result.networking = +networking
          .getPreciseOutput(networkingGrades)[0]
          .toFixed(2);
      }

      //Jika dari salah satu nilai crisp ada yang bernilai 0 maka akan mengeluarkan error
      if (
        result.software_development === 0 ||
        result.data_science === 0 ||
        result.networking === 0
      ) {
        throw error.FIS_ERROR;
      }

      if (
        result.software_development &&
        result.data_science &&
        result.networking
      ) {
        const sum =
          result.software_development + result.data_science + result.networking;

        result.softDevPercentage = (
          (result.software_development / sum) *
          100
        ).toFixed(2);
        result.dataSciPercentage = ((result.data_science / sum) * 100).toFixed(
          2
        );
        result.networkingPercentage = ((result.networking / sum) * 100).toFixed(
          2
        );

        //Mengambil data riwayat rekomendasi mahasiswa
        const getRecs = await Recommendation.findAll({
          where: { user_id: req.user.id },
          order: [["createdAt", "DESC"]],
        });

        const recCount = getRecs.length;
        const recLimit = 3;

        //Jika riwayat rekomendasi berjumlah lebih dari 3 maka data terlama akan dihapus
        if (recCount >= recLimit) {
          const oldestRecs = getRecs.slice(recLimit - 1);

          await Recommendation.destroy({
            where: {
              user_id: req.user.id,
              id: {
                [Op.in]: oldestRecs.map((rec) => rec.id),
              },
            },
          });
        }

        const createRecs = await Recommendation.create({
          crispOutput: [
            result.software_development.toFixed(2),
            result.data_science.toFixed(2),
            result.networking.toFixed(2),
          ],
          percentage: [
            result.softDevPercentage,
            result.dataSciPercentage,
            result.networkingPercentage,
          ],
          user_id: req.user.id,
        });

        if (createRecs) {
          return res.status(201).json({
            status: "Success",
            result: result,
          });
        }
      } else {
        throw error.FIS_ERROR;
      }
    } catch (err) {
      next(err);
    }
  },
};
