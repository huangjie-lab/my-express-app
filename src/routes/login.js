// 实现登录路由
const express = require("express");
const multer = require("multer");
const router = express.Router();
const {
  login,
  register,
  updateUser,
} = require("../controllers/loginController.js");
// 导入上传中间件
const upload = require("../middleware/upload");

// 登录路由
router.post("/login", login);
// 注册路由
router.post("/register", register);
// 修改用户信息 - 添加文件上传中间件
router.post(
  "/updateUser",
  (req, res, next) => {
    upload.single("img")(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({ error: "文件大小不能超过5MB" });
        } else if (err.code === "LIMIT_UNEXPECTED_FILE") {
          return res.status(400).json({ error: "文件字段名必须为img" });
        } else {
          return res.status(400).json({ error: "上传错误: " + err.message });
        }
      } else if (err) {
        return res.status(400).json({ error: err.message });
      }
      next();
    });
  },
  updateUser
);

module.exports = router;
