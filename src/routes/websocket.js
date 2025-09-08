const express = require("express");
const {
  getStats,
  getClients,
  sendToClient,
  broadcast,
  broadcastToRoom,
  disconnectClient,
  getRooms,
  getRoomMembers,
} = require("../controllers/websocketController.js");

const router = express.Router();

// WebSocket管理路由
router.get("/stats", getStats); // 获取服务器统计信息
router.get("/clients", getClients); // 获取所有客户端信息
router.post("/send/:clientId", sendToClient); // 向特定客户端发送消息
router.post("/broadcast", broadcast); // 广播消息给所有客户端
router.post("/room/:roomName/broadcast", broadcastToRoom); // 向房间广播消息
router.delete("/clients/:clientId", disconnectClient); // 强制断开客户端连接
router.get("/rooms", getRooms); // 获取所有房间信息
router.get("/room/:roomName/members", getRoomMembers); // 获取特定房间的成员信息

module.exports = router;
