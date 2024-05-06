const express = require("express");
const router = express.Router();

const controller = require("../../controllers/client/user.controller");
const validate = require("../../validates/client/user.validate");
const authMiddleware = require("../../middlewares/client/auth.middleware");

router.post("/register", validate.register, controller.register);

router.post("/login", validate.login, controller.login);

router.post("/password/forgot", validate.forgotPassword, controller.forgotPassword);

router.post("/password/otp", controller.otpPassword);

router.post("/password/reset", validate.resetPassword, controller.resetPassword);

router.get("/info", authMiddleware.requireAuth, controller.info);

module.exports = router;