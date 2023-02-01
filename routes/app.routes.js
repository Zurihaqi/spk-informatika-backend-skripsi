const router = require("express").Router();
const { signIn, signUp } = require("./auth.routes");
const authentication = require("../middlewares/passport");
const course = require("../routes/course.routes");
const grade = require("../routes/grade.routes");
const specialization = require("../routes/specialization.routes");
const errorRoutes = require("./error.routes");

router.use(signIn);
router.use(signUp);
router.use(authentication);

router.use("/course", course);
router.use("/grade", grade);
router.use("/specialization", specialization);

//error handlers
router.use((error, req, res, next) => errorRoutes(error, req, res, next));

//page not found handler
router.use((req, res) => {
  return res.status(404).json({
    status: "Not found",
    message: "Page not found",
  });
});

module.exports = router;
