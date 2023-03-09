const router = require("express").Router();
const { signIn, signUp } = require("./auth.routes");
const authenticate = require("../middlewares/passport");
const course = require("../routes/course.routes");
const grade = require("../routes/grade.routes");
const specialization = require("../routes/specialization.routes");
const user = require("../routes/user.routes");
const rule = require("../routes/rule.routes");
const fis = require("../routes/fis.routes");
const errorRoutes = require("./error.routes");

router.use(signIn);
router.use(signUp);
router.use(authenticate);

router.use("/check-connection", (req, res) => {
  return res.status(201).json({
    status: "Success",
    message: "Connected",
  });
});
router.use("/user", user);
router.use("/course", course);
router.use("/grade", grade);
router.use("/specialization", specialization);
router.use("/rule", rule);
router.use("/fis", fis);

// error handlers
router.use((error, req, res, next) => errorRoutes(error, req, res, next));

// page not found handler
router.use((req, res) => {
  return res.status(404).json({
    status: "Not found",
    message: "Page not found",
  });
});

module.exports = router;
