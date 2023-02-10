const router = require("express").Router();
const { signIn, signUp, signOut } = require("./auth.routes");
const course = require("../routes/course.routes");
const grade = require("../routes/grade.routes");
const specialization = require("../routes/specialization.routes");
const user = require("../routes/user.routes");
const rule = require("../routes/rule.routes");
const token = require("../routes/token.routes");
const errorRoutes = require("./error.routes");
const authenticate = require("../middlewares/passport");

router.use(signIn);
router.use(signUp);
router.use(signOut);
router.use(authenticate);

router.use("/user", user);
router.use("/course", course);
router.use("/grade", grade);
router.use("/specialization", specialization);
router.use("/rule", rule);
router.use("/token", token);

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
