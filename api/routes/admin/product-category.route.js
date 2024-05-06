const express = require("express");
const router = express.Router();

const controller = require("../../controllers/admin/product-category.controller.js");
const validate = require("../../validates/admin/product-category.validate.js");

router.get("/", controller.index);

router.post("/create", validate.create, controller.create);

router.patch("/change-status/:status/:id", controller.changeStatus);

router.patch("/change-multi", controller.changeMulti);

router.patch("/delete/:id", controller.delete);

router.patch("/edit/:id", validate.create, controller.edit);

router.get("/detail/:id", controller.detail);

module.exports = router;