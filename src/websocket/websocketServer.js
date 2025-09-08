const WebSocket = require("ws");
const { v4: uuidv4 } = require("uuid");
const loginModel = require("../models/loginModel.js");

class WebSocketServer {
  constructor() {
    this.wss = null;
    this.clients = new Map(); // 存储客户端连接信息
    this.rooms = new Map(); // 存储房间信息
  }

  // 初始化WebSocket服务器
  init(server) {
    this.wss = new WebSocket.Server({
      server,
      path: "/ws", // WebSocket端点路径
    });

    this.wss.on("connection", (ws, req) => {
      this.handleConnection(ws, req);
    });

    console.log("WebSocket服务器已启动，端点: /ws");
    return this.wss;
  }

  // 处理新连接
  handleConnection(ws, req) {
    const clientId = uuidv4();
    const clientInfo = {
      id: clientId,
      ws: ws,
      ip: req.socket.remoteAddress,
      userAgent: req.headers["user-agent"],
      connectedAt: new Date(),
      lastHeartbeat: new Date(),
      room: null, // 当前所在房间
      userId: null, // 用户ID（可以通过认证设置）
      isAlive: true,
    };

    // 存储客户端信息
    this.clients.set(clientId, clientInfo);

    console.log(
      `新客户端连接: ${clientId}, IP: ${clientInfo.ip}, 当前连接数: ${this.clients.size}`
    );

    // 发送连接成功消息
    this.sendToClient(clientId, {
      type: "connected",
      clientId: clientId,
      message: "连接成功",
      timestamp: new Date().toISOString(),
    });

    // 设置消息处理
    ws.on("message", (message) => {
      this.handleMessage(clientId, message);
    });

    // 设置心跳检测
    ws.on("pong", () => {
      if (this.clients.has(clientId)) {
        this.clients.get(clientId).isAlive = true;
        this.clients.get(clientId).lastHeartbeat = new Date();
      }
    });

    // 处理连接关闭
    ws.on("close", (code, reason) => {
      this.handleDisconnection(clientId, code, reason);
    });

    // 处理连接错误
    ws.on("error", (error) => {
      console.error(`客户端 ${clientId} 发生错误:`, error);
      this.handleDisconnection(clientId, 1006, "Connection error");
    });

    // 启动该客户端的心跳检测
    this.startHeartbeat(clientId);
  }

  // 处理接收到的消息
  async handleMessage(clientId, rawMessage) {
    try {
      const client = this.clients.get(clientId);
      if (!client) return;

      let message;
      try {
        message = JSON.parse(rawMessage.toString());
      } catch (e) {
        this.sendToClient(clientId, {
          type: "error",
          message: "消息格式错误，请发送JSON格式的消息",
        });
        return;
      }

      console.log(`收到客户端 ${clientId} 消息:`, message);

      // 更新最后活跃时间
      client.lastHeartbeat = new Date();

      // 根据消息类型处理
      switch (message.type) {
        case "change_product_status_by_user":
          this.changeProductStatusByUser(clientId, message);
          break;

        case "change_product_status_by_manager":
          this.changeProductStatusByManager(clientId, message);
          break;

        case "heart_beat":
          this.sendToClient(clientId, {
            type: "pong",
            timestamp: new Date().toISOString(),
          });
          break;

        case "set_user_info":
          await this.handleSetUserInfo(clientId, message);
          break;

        default:
          this.sendToClient(clientId, {
            type: "error",
            message: `未知的消息类型: ${message.type}`,
          });
      }
    } catch (error) {
      console.error(`处理客户端 ${clientId} 消息时发生错误:`, error);
      this.sendToClient(clientId, {
        type: "error",
        message: "服务器处理消息时发生错误",
      });
    }
  }

  // 处理广播消息
  handleBroadcast(clientId, message) {
    const client = this.clients.get(clientId);
    if (!client) return;

    const broadcastData = {
      type: "broadcast",
      from: clientId,
      fromUserId: client.userId,
      content: message.content,
      timestamp: new Date().toISOString(),
    };

    // 广播给所有客户端（除了发送者）
    this.broadcast(broadcastData, clientId);

    console.log(`客户端 ${clientId} 发送广播消息:`, message.content);
  }

  // 处理私人消息
  handlePrivateMessage(clientId, message) {
    const { targetClientId, content } = message;

    if (!this.clients.has(targetClientId)) {
      this.sendToClient(clientId, {
        type: "error",
        message: "目标客户端不存在或已断开连接",
      });
      return;
    }

    const fromClient = this.clients.get(clientId);
    const messageData = {
      type: "private_message",
      from: clientId,
      fromUserId: fromClient.userId,
      content: content,
      timestamp: new Date().toISOString(),
    };

    // 发送给目标客户端
    this.sendToClient(targetClientId, messageData);

    // 给发送者发送确认
    this.sendToClient(clientId, {
      type: "message_sent",
      to: targetClientId,
      content: content,
      timestamp: new Date().toISOString(),
    });

    console.log(`客户端 ${clientId} 向 ${targetClientId} 发送私人消息`);
  }

  // 处理设置用户信息
  async handleSetUserInfo(clientId, message) {
    const client = this.clients.get(clientId);
    if (!client) return;

    try {
      const { userId, username, email, updateDatabase = true } = message;

      // 验证必填字段
      if (!userId) {
        this.sendToClient(clientId, {
          type: "error",
          message: "用户ID不能为空",
        });
        return;
      }

      // 更新WebSocket客户端信息
      client.userId = userId;

      // 如果需要更新数据库
      if (updateDatabase) {
        console.log(`客户端 ${clientId} 请求更新数据库用户信息: ${userId}`);

        // 检查用户是否存在
        const existingUser = await loginModel.getUserById(userId);
        console.log(existingUser, "existingUser");

        if (!existingUser) {
          this.sendToClient(clientId, {
            type: "error",
            message: `用户不存在: ${userId}`,
          });
          return;
        }

        // 构建更新数据
        const updateData = {};
        if (username !== undefined) updateData.username = username;
        if (email !== undefined) updateData.email = email;

        // 只有当有实际数据需要更新时才调用数据库
        if (Object.keys(updateData).length > 0) {
          try {
            const isUpdated = await loginModel.updateUser(userId, updateData);

            if (isUpdated) {
              // 获取更新后的用户信息
              const updatedUser = await loginModel.getUserById(userId);

              this.sendToClient(clientId, {
                type: "user_info_updated",
                userId: userId,
                message: "用户信息已成功更新到数据库",
                userData: {
                  user_id: updatedUser.user_id,
                  username: updatedUser.username,
                  email: updatedUser.email,
                  role: updatedUser.role,
                  img: updatedUser.img,
                },
              });

              console.log(
                `客户端 ${clientId} 成功更新数据库用户信息: ${userId}`
              );
            } else {
              this.sendToClient(clientId, {
                type: "error",
                message: "数据库更新失败，请稍后重试",
              });
            }
          } catch (dbError) {
            console.error(`数据库更新用户信息失败 (${clientId}):`, dbError);
            this.sendToClient(clientId, {
              type: "error",
              message: "数据库操作失败: " + dbError.message,
            });
          }
        } else {
          this.sendToClient(clientId, {
            type: "user_info_updated",
            userId: userId,
            message: "WebSocket用户信息已更新（无数据库更改）",
          });
        }
      } else {
        // 仅更新WebSocket客户端信息
        this.sendToClient(clientId, {
          type: "user_info_updated",
          userId: userId,
          message: "WebSocket用户信息已更新",
        });

        console.log(`客户端 ${clientId} 设置用户ID: ${userId}`);
      }
    } catch (error) {
      console.error(`处理用户信息设置失败 (${clientId}):`, error);
      this.sendToClient(clientId, {
        type: "error",
        message: "处理用户信息时发生错误: " + error.message,
      });
    }
  }

  // 处理连接断开
  handleDisconnection(clientId, code, reason) {
    const client = this.clients.get(clientId);
    if (!client) return;

    console.log(
      `客户端断开连接: ${clientId}, 代码: ${code}, 原因: ${
        reason || "无"
      }, 当前连接数: ${this.clients.size - 1}`
    );

    // 停止心跳检测
    if (client.heartbeatInterval) {
      clearInterval(client.heartbeatInterval);
    }

    // 从客户端列表中移除
    this.clients.delete(clientId);
  }

  // 发送消息给特定客户端
  sendToClient(clientId, data) {
    const client = this.clients.get(clientId);
    if (!client || client.ws.readyState !== WebSocket.OPEN) return false;

    try {
      client.ws.send(JSON.stringify(data));
      return true;
    } catch (error) {
      console.error(`向客户端 ${clientId} 发送消息失败:`, error);
      return false;
    }
  }

  // 广播消息给所有客户端
  broadcast(data, excludeClientId = null) {
    let sentCount = 0;
    for (const [clientId, client] of this.clients) {
      if (
        clientId !== excludeClientId &&
        client.ws.readyState === WebSocket.OPEN
      ) {
        if (this.sendToClient(clientId, data)) {
          sentCount++;
        }
      }
    }
    return sentCount;
  }

  // 广播消息给房间内所有客户端
  broadcastToRoom(roomName, data, excludeClientId = null) {
    const room = this.rooms.get(roomName);
    if (!room) return 0;

    let sentCount = 0;
    for (const clientId of room) {
      if (clientId !== excludeClientId) {
        if (this.sendToClient(clientId, data)) {
          sentCount++;
        }
      }
    }
    return sentCount;
  }

  // 启动心跳检测
  startHeartbeat(clientId) {
    const client = this.clients.get(clientId);
    if (!client) return;

    client.heartbeatInterval = setInterval(() => {
      if (!client.isAlive) {
        console.log(`客户端 ${clientId} 心跳超时，断开连接`);
        client.ws.terminate();
        return;
      }

      client.isAlive = false;
      client.ws.ping();
    }, 30000); // 30秒心跳检测
  }

  // 获取服务器统计信息
  getStats() {
    return {
      totalClients: this.clients.size,
      totalRooms: this.rooms.size,
      rooms: Array.from(this.rooms.entries()).map(([name, clients]) => ({
        name,
        memberCount: clients.size,
      })),
      uptime: process.uptime(),
    };
  }

  // 获取所有客户端信息
  getClientsInfo() {
    return Array.from(this.clients.entries()).map(([id, client]) => ({
      id,
      ip: client.ip,
      userId: client.userId,
      room: client.room,
      connectedAt: client.connectedAt,
      lastHeartbeat: client.lastHeartbeat,
      isAlive: client.isAlive,
    }));
  }

  // 强制断开客户端连接
  disconnectClient(clientId, reason = "服务器断开连接") {
    const client = this.clients.get(clientId);
    if (!client) return false;

    this.sendToClient(clientId, {
      type: "force_disconnect",
      reason: reason,
    });

    setTimeout(() => {
      client.ws.close(1000, reason);
    }, 100);

    return true;
  }
}

// 创建单例实例
const wsServer = new WebSocketServer();

module.exports = wsServer;
