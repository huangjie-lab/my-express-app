const express = require("express");
const router = express.Router();
const goodsController = require("../controllers/goodsController");

// 获取商品列表
router.post("/getGoods", goodsController.getGoods);

// 添加商品
router.post("/addGood", goodsController.addGood);

// 更新商品
router.put("/updateGood/:id", goodsController.updateGood);

// 删除商品
router.delete("/delGood/:id", goodsController.delGood);

module.exports = router;
