require("dotenv/config"); // 放在文件最顶部
const app = require("./app.js");
const wsServer = require("./websocket/websocketServer.js");

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);

  // 初始化WebSocket服务器
  wsServer.init(server);
  console.log(`WebSocket服务器已启动，可通过 ws://localhost:${PORT}/ws 连接`);
});

// 优雅关闭处理
const gracefulShutdown = () => {
  console.log("正在关闭服务器...");

  server.close(() => {
    console.log("HTTP服务器已关闭");

    // 如果有WebSocket连接，通知所有客户端服务器即将关闭
    if (wsServer.wss) {
      wsServer.broadcast({
        type: "server_shutdown",
        message: "服务器即将关闭",
        timestamp: new Date().toISOString(),
      });

      // 给客户端一些时间处理关闭消息
      setTimeout(() => {
        wsServer.wss.close(() => {
          console.log("WebSocket服务器已关闭");
          process.exit(0);
        });
      }, 1000);
    } else {
      process.exit(0);
    }
  });
};

// 处理未捕获的 Promise 异常
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  gracefulShutdown();
});

// 处理进程信号
process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);
