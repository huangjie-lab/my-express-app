// 实现登录路由
const express = require("express");
const router = express.Router();
const { login, register } = require("../controllers/loginController.js");

// 验证 Token 的中间件
// function authenticateToken(req, res, next) {
//   const authHeader = req.headers["authorization"];
//   const token = authHeader && authHeader.split(" ")[1];

//   if (!token) {
//     return res.status(401).json({ message: "No token provided" }); // 如果没有 Token，则返回 401 未授权
//   }

//   // 验证 Token
//   jwt.verify(token, SECRET_KEY, (err, user) => {
//     if (err) {
//       return res.status(403).json({ message: "Invalid token" }); // 如果 Token 无效，则返回 403 禁止访问
//     }

//     // 将解密后的用户信息保存到请求对象中
//     req.user = user;
//     next();
//   });
// }

// 登录路由
router.post("/login", login);
// 注册路由
router.post("/register", register);

// 受保护的路由，只有有效 Token 才能访问
// router.get("/protected", authenticateToken, (req, res) => {
//   res.json({ message: "This is a protected route", user: req.user });
// });

module.exports = router;
