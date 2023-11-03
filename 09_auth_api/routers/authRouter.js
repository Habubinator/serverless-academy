const Router = require("express");
const controller = require("../controllers/authController");
const router = new Router();

router.post("/sign-up", controller.registration)
router.post("/sign-in", controller.login)

module.exports = router