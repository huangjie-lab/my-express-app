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

// 退仓的数据表
// CREATE TABLE `exit_asin_table` (
//     `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
//     `asin` VARCHAR(20) NOT NULL COMMENT 'Amazon ASIN',
//     `brand` VARCHAR(100) NOT NULL COMMENT 'Brand name',
//     `title` VARCHAR(255) NOT NULL COMMENT 'Product title',
//     `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
//     `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
//     PRIMARY KEY (`id`),
//     KEY `idx_asin` (`asin`),
//     KEY `idx_brand` (`brand`),
//     KEY `idx_title` (`title`)
//   ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
