// 实现产品路由
const express = require("express");
const router = express.Router();
const {
  getAllProduct,
  createProduct,
  deleteProduct,
  updateProduct,
  importProducts,
  exportProducts,
} = require("../../controllers/productManager/index.js");
const excelUpload = require("../../middleware/excelUpload.js");

// 查询所有产品路由
router.post("/getAllProduct", getAllProduct);

// 新增产品路由
router.post("/addProduct", createProduct);

// 删除产品路由
router.delete("/deleteProduct/:id", deleteProduct);

// 更新产品路由
router.put("/updateProduct/:id", updateProduct);

// 导入Excel产品数据路由
router.post("/importProducts", excelUpload.single("file"), importProducts);

// 导出产品数据为Excel路由
router.post("/exportProducts", exportProducts);

module.exports = router;
