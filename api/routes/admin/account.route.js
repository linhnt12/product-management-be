const express = require("express");
const router = express.Router();

const controller = require("../../controllers/admin/account.controller");
const validate = require("../../validates/admin/account.validate");

router.get("/", controller.index);

router.post("/create", validate.create, controller.create);

router.patch("/edit/:id", validate.edit, controller.edit);

router.get("/detail/:id", controller.detail);

module.exports = router;