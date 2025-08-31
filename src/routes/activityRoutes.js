const express = require("express");
const router = express.Router();
const activityController = require("../controllers/activityController");

// 定义活动相关路由
router.post("/getActivities", activityController.getActivities);
router.post("/addActivity", activityController.addActivities);
router.put("/updateActivity/:id", activityController.updateActivities);
router.delete("/delActivity/:id", activityController.delActivities);

module.exports = router;
