const express = require("express");
const router = express.Router();

const controller = require("../../controllers/admin/my-account.controller");
const validate = require("../../validates/admin/account.validate");

router.get("/", controller.index);

router.patch("/edit", validate.edit, controller.edit);

module.exports = router;