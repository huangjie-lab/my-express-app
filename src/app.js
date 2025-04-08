const express = require("express");
const app = express();
const path = require("path");
const PORT = process.env.PORT || 3000;

// 中间件配置
app.use(express.json()); // 解析 JSON 请求体
app.use(express.urlencoded({ extended: true })); // 解析表单数据
app.use(express.static(path.join(__dirname, "../build"))); // 加载前端静态资源

// 路由配置
const router = require("./routes/users.js");
app.use("/api", router);

// 404 处理
app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// 所有其他路由都重定向到index.html，这样前端路由才能正常工作 (todo... 这里匹配所有路径还有点问题)
// app.use((req, res, next) => {
//   res.sendFile(path.join(__dirname, "../build", "index.html"));
//   next();
// });

// 导出 app 用于测试
module.exports = app;

// 仅当直接运行时启动服务器
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server1 running on http://localhost:${PORT}`);
  });
}
