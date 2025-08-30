// 退仓相关接口
const express = require("express");
const router = express.Router();

const AsinControllers = require("../controllers/asin/index");

// 添加 ASIN（读取 body）
router.post("/addAsin", AsinControllers.addAsin);
router.post("/editAsin", AsinControllers.editAsin);
router.post("/delAsin", AsinControllers.deleteAsin);
router.get("/getAsins", AsinControllers.getAsins);

module.exports = router;
