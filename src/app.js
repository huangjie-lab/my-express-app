const express = require("express");
const app = express();
const path = require("path");
const PORT = process.env.PORT || 3000;

// 中间件配置
app.use(express.json()); // 解析 JSON 请求体
app.use(express.urlencoded({ extended: true })); // 解析表单数据
app.use(express.static(path.join(__dirname, "../../build"))); // 加载前端静态资源

// 路由配置
const userRouter = require("./routes/users.js");
const loginRouter = require("./routes/login.js");

app.use("/api", userRouter);
app.use("/api", loginRouter);

// 404 处理
app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// 导出 app 用于测试
module.exports = app;

// 仅当直接运行时启动服务器
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server1 running on http://localhost:${PORT}`);
  });
}
