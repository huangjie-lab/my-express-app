const express = require("express");
const app = express();
const path = require("path");
const PORT = process.env.PORT || 3000;

// 添加文件上传配置
const upload = require("./middleware/upload");

// 中间件配置
app.use(express.json()); // 解析 JSON 请求体
app.use(express.urlencoded({ extended: true })); // 解析表单数据
// 配置静态文件服务（用于访问上传的图片）
app.use("/uploads", express.static(path.join(__dirname, "../../uploads")));
app.use(express.static(path.join(__dirname, "../../build"))); // 加载前端静态资源

// 路由配置
const userRouter = require("./routes/users.js");
const loginRouter = require("./routes/login.js");
const asinRouter = require("./routes/asin.js");
const { authenticateToken } = require("./middleware/auth.js");
const productManagerRouter = require("./routes/productManager/index.js");
const goodsRouter = require("./routes/goods");
const activityRouter = require("./routes/activityRoutes.js");

// 公开路由（无需鉴权）应在鉴权中间件之前挂载
app.use("/api", loginRouter);

// 本地开发环境放行 asinRouter，其它环境走鉴权
if (process.env.NODE_ENV === "development") {
  app.use("/api", asinRouter);
  app.use("/api", userRouter);
  app.use("/api", productManagerRouter);
  app.use("/api", goodsRouter);
  app.use("/api", activityRouter);
}

// 自此之后的 /api 路由均需要鉴权
// app.use("/api", authenticateToken);

// 非开发环境下，asinRouter 在鉴权之后挂载
if (process.env.NODE_ENV !== "development") {
  app.use("/api", asinRouter);
  app.use("/api", userRouter);
  app.use("/api", productManagerRouter);
  app.use("/api", goodsRouter);
  app.use("/api", activityRouter);
}

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
