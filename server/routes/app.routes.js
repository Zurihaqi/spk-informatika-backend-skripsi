const router = require("express").Router();
const { signIn, signUp } = require("./auth.routes");
const { authentication } = require("../middlewares/passport");
const routes = [
  { path: "/user", module: require("../routes/user.routes") },
  { path: "/course", module: require("../routes/course.routes") },
  { path: "/grade", module: require("../routes/grade.routes") },
  {
    path: "/specialization",
    module: require("../routes/specialization.routes"),
  },
  { path: "/rule", module: require("../routes/rule.routes") },
  { path: "/fis", module: require("../routes/fis.routes") },
  {
    path: "/recommendation",
    module: require("../routes/recommendation.routes"),
  },
  { path: "/notification", module: require("../routes/notification.routes") },
  { path: "/stat", module: require("../routes/fisStats.routes") },
];
const errorRoutes = require("./error.routes");

router.use(signIn);
router.use(signUp);
router.use(authentication);

for (const route of routes) {
  router.use(route.path, route.module);
}

// Error handlers
router.use((error, req, res, next) => errorRoutes(error, req, res, next));

// Page not found handler
router.use((req, res) => {
  return res.status(404).json({
    status: "Not found",
    message: "Page not found",
  });
});

module.exports = router;
