// 实现登录路由
const express = require("express");
const router = express.Router();
const {
  login,
  register,
  updateUser,
} = require("../controllers/loginController.js");

// 登录路由
router.post("/login", login);
// 注册路由
router.post("/register", register);
// 修改用户信息
router.post("/updateUser", updateUser);

module.exports = router;
