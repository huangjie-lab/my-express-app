const express = require("express");
const {
  getAllCheckPrice,
  getCheckPriceById,
  createCheckPrice,
  updateCheckPrice,
  deleteCheckPrice,
  exportCheckPrice,
} = require("../controllers/checkPriceController.js");

const router = express.Router();

// 核价数据路由
router.post("/getAllCheckPrice", getAllCheckPrice); // 获取所有核价数据（支持分页和搜索）
router.get("/checkPrice/:id", getCheckPriceById); // 根据ID获取核价数据
router.post("/addCheckPrice", createCheckPrice); // 创建核价数据
router.put("/updateCheckPrice/:id", updateCheckPrice); // 更新核价数据
router.delete("/delCheckPrice/:id", deleteCheckPrice); // 删除核价数据
router.post("/exportCheckPrice", exportCheckPrice); // 导出核价数据为Excel（支持过滤）

module.exports = router;
