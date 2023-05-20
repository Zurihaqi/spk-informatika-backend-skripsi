const { Recommendation, Grade, Course } = require("../db/models");

function getBackgroundColor(spec_id) {
  const randomShade = Math.random();
  switch (spec_id) {
    case 1:
      return generateShade("ff0000", randomShade);
    case 2:
      return generateShade("0000ff", randomShade);
    case 3:
      return generateShade("00ff00", randomShade);
    default:
      return "#000000";
  }
}

function generateShade(color, shade) {
  const minBrightness = 0.5;
  const red =
    color === "ff0000"
      ? Math.floor((shade * (1 - minBrightness) + minBrightness) * 256)
      : 0;
  const green =
    color === "00ff00"
      ? Math.floor((shade * (1 - minBrightness) + minBrightness) * 256)
      : 0;
  const blue =
    color === "0000ff"
      ? Math.floor((shade * (1 - minBrightness) + minBrightness) * 256)
      : 0;
  const hex = `#${red.toString(16).padStart(2, "0")}${green
    .toString(16)
    .padStart(2, "0")}${blue.toString(16).padStart(2, "0")}`;
  return hex;
}

function gradesStats(grades) {
  const courseGrades = {};
  const results = {
    softDevGrades: { labels: [], datasets: [] },
    dataSciGrades: { labels: [], datasets: [] },
    networkingGrades: { labels: [], datasets: [] },
  };

  grades.forEach((entry) => {
    const {
      course_id,
      numbered_grade,
      Course: { course_name, spec_id },
    } = entry;
    if (!(course_id in courseGrades)) {
      courseGrades[course_id] = {
        course_id,
        course_name,
        spec_id,
        total_grades: 0,
        count: 0,
      };
    }
    courseGrades[course_id].total_grades += numbered_grade;
    courseGrades[course_id].count++;
  });

  const averageGrades = Object.values(courseGrades).map(
    ({ course_id, course_name, spec_id, total_grades, count }) => ({
      course_id,
      course_name,
      spec_id,
      average_numbered_grades: total_grades / count,
    })
  );

  const datasets = {
    1: { labels: [], backgroundColor: [], data: [] },
    2: { labels: [], backgroundColor: [], data: [] },
    3: { labels: [], backgroundColor: [], data: [] },
  };

  averageGrades.forEach((entry) => {
    const { spec_id, course_name, average_numbered_grades } = entry;

    datasets[spec_id].labels.push(course_name);
    datasets[spec_id].backgroundColor.push(getBackgroundColor(spec_id));
    datasets[spec_id].data.push(average_numbered_grades);
  });

  results.softDevGrades.labels = datasets[1].labels;
  results.dataSciGrades.labels = datasets[2].labels;
  results.networkingGrades.labels = datasets[3].labels;

  [1, 2, 3].forEach((spec_id) => {
    if (datasets[spec_id].data.length > 0) {
      results[`${getSpecName(spec_id)}Grades`].datasets.push({
        label: `Rata-rata nilai`,
        backgroundColor: datasets[spec_id].backgroundColor.slice(),
        data: datasets[spec_id].data.slice(),
      });
    }
  });

  return results;
}

function getSpecName(spec_id) {
  const specNames = {
    1: "softDev",
    2: "dataSci",
    3: "networking",
  };
  return specNames[spec_id] || "";
}

function recsStats(recommendations) {
  const newestTimestamps = {};
  const newestCrispOutputs = [];
  const result = [];
  let percentageResult = [];

  recommendations.forEach((entry) => {
    const { user_id, createdAt } = entry;
    if (
      !(user_id in newestTimestamps) ||
      createdAt > newestTimestamps[user_id]
    ) {
      newestTimestamps[user_id] = createdAt;
    }
  });

  recommendations.forEach((entry) => {
    const { user_id, crispOutput, createdAt } = entry;
    if (createdAt === newestTimestamps[user_id]) {
      newestCrispOutputs.push({
        user_id,
        crispOutput,
      });
    }
  });

  const datasets = {
    softDev: [],
    dataSci: [],
    networking: [],
  };

  newestCrispOutputs.forEach(({ crispOutput }) => {
    const highestValue = Math.max(...crispOutput);
    const [dataSci, softDev, networking] = crispOutput;

    datasets.softDev.push(dataSci === highestValue ? highestValue : null);
    datasets.dataSci.push(softDev === highestValue ? highestValue : null);
    datasets.networking.push(networking === highestValue ? highestValue : null);
  });

  result.push(
    datasets.dataSci.filter((value) => value !== null).length,
    datasets.softDev.filter((value) => value !== null).length,
    datasets.networking.filter((value) => value !== null).length
  );

  const combinedDataset = [
    ...datasets.softDev,
    ...datasets.dataSci,
    ...datasets.networking,
  ];
  const totalCombined = combinedDataset.filter(
    (value) => value !== null
  ).length;

  const softDevPercentage = Math.round(
    (datasets.softDev.filter((value) => value !== null).length /
      totalCombined) *
      100
  );
  const dataSciPercentage = Math.round(
    (datasets.dataSci.filter((value) => value !== null).length /
      totalCombined) *
      100
  );
  const networkingPercentage = Math.round(
    (datasets.networking.filter((value) => value !== null).length /
      totalCombined) *
      100
  );

  percentageResult = [
    dataSciPercentage,
    softDevPercentage,
    networkingPercentage,
  ];

  return {
    result,
    percentageResult,
  };
}

module.exports = {
  getStats: async (req, res, next) => {
    try {
      const [recommendations, grades] = await Promise.all([
        Recommendation.findAll(),
        Grade.findAll({ include: { model: Course } }),
      ]);

      const grade_stats = gradesStats(grades);
      const recs_stats = recsStats(recommendations);

      return res.status(201).json({
        status: "Success",
        grade_stats,
        recs_stats,
      });
    } catch (err) {
      next(err);
    }
  },
};
