// 实现产品路由
const express = require("express");
const router = express.Router();
const {
  getAllProduct,
  createProduct,
  deleteProduct,
  updateProduct,
} = require("../../controllers/productManager/index.js");

// 查询所有产品路由
router.post("/getAllProduct", getAllProduct);

// 新增产品路由
router.post("/addProduct", createProduct);

// 删除产品路由
router.delete("/deleteProduct/:id", deleteProduct);

// 更新产品路由
router.put("/updateProduct/:id", updateProduct);

module.exports = router;
