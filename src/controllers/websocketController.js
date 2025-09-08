const wsServer = require("../websocket/websocketServer.js");

// 获取WebSocket服务器统计信息
const getStats = async (req, res) => {
  try {
    const stats = wsServer.getStats();
    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("获取WebSocket统计信息失败:", error);
    res.status(500).json({
      success: false,
      message: "获取统计信息失败",
      error: error.message,
    });
  }
};

// 获取所有客户端信息
const getClients = async (req, res) => {
  try {
    const clients = wsServer.getClientsInfo();
    res.status(200).json({
      success: true,
      data: clients,
      total: clients.length,
    });
  } catch (error) {
    console.error("获取客户端信息失败:", error);
    res.status(500).json({
      success: false,
      message: "获取客户端信息失败",
      error: error.message,
    });
  }
};

// 向特定客户端发送消息
const sendToClient = async (req, res) => {
  try {
    const { clientId } = req.params;
    const { type = "message", content, data } = req.body;

    if (!clientId) {
      return res.status(400).json({
        success: false,
        message: "客户端ID不能为空",
      });
    }

    const messageData = {
      type: type,
      content: content,
      data: data,
      from: "server",
      timestamp: new Date().toISOString(),
    };

    const success = wsServer.sendToClient(clientId, messageData);

    if (success) {
      res.status(200).json({
        success: true,
        message: "消息发送成功",
        clientId: clientId,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "客户端不存在或连接已断开",
      });
    }
  } catch (error) {
    console.error("发送消息失败:", error);
    res.status(500).json({
      success: false,
      message: "发送消息失败",
      error: error.message,
    });
  }
};

// 广播消息给所有客户端
const broadcast = async (req, res) => {
  try {
    const { type = "broadcast", content, data, excludeClientId } = req.body;

    const messageData = {
      type: type,
      content: content,
      data: data,
      from: "server",
      timestamp: new Date().toISOString(),
    };

    const sentCount = wsServer.broadcast(messageData, excludeClientId);

    res.status(200).json({
      success: true,
      message: "广播消息发送成功",
      sentCount: sentCount,
    });
  } catch (error) {
    console.error("广播消息失败:", error);
    res.status(500).json({
      success: false,
      message: "广播消息失败",
      error: error.message,
    });
  }
};

// 向房间内所有客户端发送消息
const broadcastToRoom = async (req, res) => {
  try {
    const { roomName } = req.params;
    const { type = "room_message", content, data, excludeClientId } = req.body;

    if (!roomName) {
      return res.status(400).json({
        success: false,
        message: "房间名称不能为空",
      });
    }

    const messageData = {
      type: type,
      room: roomName,
      content: content,
      data: data,
      from: "server",
      timestamp: new Date().toISOString(),
    };

    const sentCount = wsServer.broadcastToRoom(
      roomName,
      messageData,
      excludeClientId
    );

    res.status(200).json({
      success: true,
      message: "房间消息发送成功",
      room: roomName,
      sentCount: sentCount,
    });
  } catch (error) {
    console.error("房间消息发送失败:", error);
    res.status(500).json({
      success: false,
      message: "房间消息发送失败",
      error: error.message,
    });
  }
};

// 强制断开客户端连接
const disconnectClient = async (req, res) => {
  try {
    const { clientId } = req.params;
    const { reason = "服务器断开连接" } = req.body;

    if (!clientId) {
      return res.status(400).json({
        success: false,
        message: "客户端ID不能为空",
      });
    }

    const success = wsServer.disconnectClient(clientId, reason);

    if (success) {
      res.status(200).json({
        success: true,
        message: "客户端连接已断开",
        clientId: clientId,
        reason: reason,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "客户端不存在",
      });
    }
  } catch (error) {
    console.error("断开客户端连接失败:", error);
    res.status(500).json({
      success: false,
      message: "断开连接失败",
      error: error.message,
    });
  }
};

// 获取房间信息
const getRooms = async (req, res) => {
  try {
    const stats = wsServer.getStats();
    res.status(200).json({
      success: true,
      data: stats.rooms,
      total: stats.totalRooms,
    });
  } catch (error) {
    console.error("获取房间信息失败:", error);
    res.status(500).json({
      success: false,
      message: "获取房间信息失败",
      error: error.message,
    });
  }
};

// 获取特定房间的成员信息
const getRoomMembers = async (req, res) => {
  try {
    const { roomName } = req.params;

    if (!roomName) {
      return res.status(400).json({
        success: false,
        message: "房间名称不能为空",
      });
    }

    const allClients = wsServer.getClientsInfo();
    const roomMembers = allClients.filter((client) => client.room === roomName);

    res.status(200).json({
      success: true,
      data: roomMembers,
      room: roomName,
      total: roomMembers.length,
    });
  } catch (error) {
    console.error("获取房间成员信息失败:", error);
    res.status(500).json({
      success: false,
      message: "获取房间成员信息失败",
      error: error.message,
    });
  }
};

module.exports = {
  getStats,
  getClients,
  sendToClient,
  broadcast,
  broadcastToRoom,
  disconnectClient,
  getRooms,
  getRoomMembers,
};
