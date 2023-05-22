const router = require("express").Router();
const controller = require("../controllers/audit.controller");
const { isAdmin, isPengelola } = require("../middlewares/passport");

router.get("/", isPengelola, controller.getAll);
router.delete("/", isAdmin, controller.deleteAll);
router.delete("/:id", isAdmin, controller.deleteOne);

module.exports = router;
