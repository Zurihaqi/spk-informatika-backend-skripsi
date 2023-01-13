const router = require("express").Router();

const { signIn, signUp } = require("./auth.routes");
const authentication = require("../middlewares/passport");

const errorRoutes = require("./error.routes");

router.use(signIn);
router.use(signUp);
router.use(authentication);

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
