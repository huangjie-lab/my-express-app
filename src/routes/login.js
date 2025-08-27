// 实现登录路由
const express = require("express");
const router = express.Router();
const { login, register } = require("../controllers/loginController.js");

// 登录路由
router.post("/login", login);
// 注册路由
router.post("/register", register);

module.exports = router;
