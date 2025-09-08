# 🔌 WebSocket 服务使用说明

本项目集成了完整的 WebSocket 服务，支持多客户端连接、房间管理、消息广播等功能。

## 🚀 快速开始

### 1. 启动服务器

```bash
npm run dev
# 或
pnpm dev
```

服务器启动后，WebSocket 服务将在以下地址可用：

- **WebSocket 端点**: `ws://localhost:3000/ws`
- **HTTP 管理接口**: `http://localhost:3000/api/ws/*`

### 2. 测试连接

打开项目根目录下的 `websocket-client-example.html` 文件即可开始测试。

## 📋 功能特性

### ✨ 核心功能

- ✅ **多客户端连接**: 支持无限数量的客户端同时连接
- ✅ **实时消息传递**: 支持广播、房间消息、私人消息
- ✅ **房间管理**: 客户端可以加入/离开房间，房间内消息隔离
- ✅ **连接管理**: 自动心跳检测，连接状态监控
- ✅ **用户身份识别**: 支持设置用户 ID，便于识别
- ✅ **HTTP 管理接口**: 提供 RESTful API 管理 WebSocket 连接

### 🛡️ 高级特性

- ✅ **心跳检测**: 30 秒心跳周期，自动清理死连接
- ✅ **优雅关闭**: 服务器关闭时通知所有客户端
- ✅ **错误处理**: 完善的错误捕获和处理机制
- ✅ **连接统计**: 实时连接数、房间数等统计信息
- ✅ **消息类型**: 支持多种消息类型，便于业务扩展

## 🔗 WebSocket 客户端连接

### JavaScript 客户端示例

```javascript
// 连接到 WebSocket 服务器
const ws = new WebSocket("ws://localhost:3000/ws");

ws.onopen = function (event) {
  console.log("连接已建立");

  // 设置用户信息（可选）
  ws.send(
    JSON.stringify({
      type: "set_user_info",
      userId: "user123",
      username: "张三",
      email: "zhangsan@example.com",
      updateDatabase: true, // 是否同时更新数据库
    })
  );
};

ws.onmessage = function (event) {
  const data = JSON.parse(event.data);
  console.log("收到消息:", data);
};

ws.onclose = function (event) {
  console.log("连接已关闭");
};

ws.onerror = function (error) {
  console.error("WebSocket错误:", error);
};
```

## 📨 消息类型

### 客户端 → 服务器

| 消息类型          | 描述         | 参数                                            | 示例                                                                                    |
| ----------------- | ------------ | ----------------------------------------------- | --------------------------------------------------------------------------------------- |
| `set_user_info`   | 设置用户信息 | `userId`, `username`, `email`, `updateDatabase` | `{type: 'set_user_info', userId: 'user123', username: 'newname', updateDatabase: true}` |
| `join_room`       | 加入房间     | `room`                                          | `{type: 'join_room', room: 'chat-room'}`                                                |
| `leave_room`      | 离开房间     | 无                                              | `{type: 'leave_room'}`                                                                  |
| `broadcast`       | 广播消息     | `content`                                       | `{type: 'broadcast', content: 'Hello World'}`                                           |
| `room_message`    | 房间消息     | `content`                                       | `{type: 'room_message', content: 'Hi there'}`                                           |
| `private_message` | 私人消息     | `targetClientId`, `content`                     | `{type: 'private_message', targetClientId: 'client-id', content: 'Hello'}`              |
| `ping`            | 心跳检测     | 无                                              | `{type: 'ping'}`                                                                        |

### 服务器 → 客户端

| 消息类型            | 描述             | 字段                                                 |
| ------------------- | ---------------- | ---------------------------------------------------- |
| `connected`         | 连接成功         | `clientId`, `message`, `timestamp`                   |
| `user_info_updated` | 用户信息更新成功 | `userId`, `message`, `userData` (可选)               |
| `joined_room`       | 加入房间成功     | `room`, `message`, `roomMemberCount`                 |
| `left_room`         | 离开房间成功     | `room`, `message`                                    |
| `user_joined`       | 用户加入房间通知 | `clientId`, `userId`, `roomMemberCount`              |
| `user_left`         | 用户离开房间通知 | `clientId`, `userId`, `roomMemberCount`              |
| `broadcast`         | 广播消息         | `from`, `fromUserId`, `content`, `timestamp`         |
| `room_message`      | 房间消息         | `room`, `from`, `fromUserId`, `content`, `timestamp` |
| `private_message`   | 私人消息         | `from`, `fromUserId`, `content`, `timestamp`         |
| `pong`              | 心跳响应         | `timestamp`                                          |
| `error`             | 错误消息         | `message`                                            |
| `server_shutdown`   | 服务器关闭通知   | `message`, `timestamp`                               |

## 🛠️ HTTP 管理接口

### API 端点

| 方法     | 路径                               | 描述                 | 参数                                         |
| -------- | ---------------------------------- | -------------------- | -------------------------------------------- |
| `GET`    | `/api/ws/stats`                    | 获取服务器统计信息   | 无                                           |
| `GET`    | `/api/ws/clients`                  | 获取所有客户端信息   | 无                                           |
| `POST`   | `/api/ws/send/:clientId`           | 向特定客户端发送消息 | `type`, `content`, `data`                    |
| `POST`   | `/api/ws/broadcast`                | 广播消息             | `type`, `content`, `data`, `excludeClientId` |
| `POST`   | `/api/ws/room/:roomName/broadcast` | 向房间广播消息       | `type`, `content`, `data`, `excludeClientId` |
| `DELETE` | `/api/ws/clients/:clientId`        | 强制断开客户端       | `reason`                                     |
| `GET`    | `/api/ws/rooms`                    | 获取所有房间信息     | 无                                           |
| `GET`    | `/api/ws/room/:roomName/members`   | 获取房间成员信息     | 无                                           |

### API 使用示例

```javascript
// 获取服务器统计信息
const stats = await fetch("/api/ws/stats").then((res) => res.json());
console.log("当前连接数:", stats.data.totalClients);

// 向特定客户端发送消息
await fetch("/api/ws/send/client-id-123", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    type: "notification",
    content: "服务器通知消息",
  }),
});

// 广播消息
await fetch("/api/ws/broadcast", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    type: "announcement",
    content: "系统公告：服务器即将维护",
  }),
});

// 向房间广播消息
await fetch("/api/ws/room/chat-room/broadcast", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    content: "房间管理员消息",
  }),
});
```

## 🏗️ 架构设计

### 文件结构

```bash
src/
├── websocket/
│   └── websocketServer.js     # WebSocket 服务器核心类
├── controllers/
│   └── websocketController.js # WebSocket HTTP 接口控制器
├── routes/
│   └── websocket.js          # WebSocket 路由配置
├── index.js                  # 主入口文件（集成 WebSocket）
└── app.js                    # Express 应用配置
```

### 核心类：WebSocketServer

- **连接管理**: 维护所有客户端连接的状态和信息
- **房间管理**: 支持客户端加入/离开房间，房间消息隔离
- **消息处理**: 处理各种类型的消息，包括广播、私聊等
- **心跳检测**: 定期检查连接状态，清理死连接
- **统计信息**: 提供连接数、房间数等实时统计

## 🎯 使用场景

### 1. 用户信息同步

```javascript
// 连接成功后同时更新WebSocket和数据库中的用户信息
ws.send(
  JSON.stringify({
    type: "set_user_info",
    userId: "user123",
    username: "新用户名",
    email: "newemail@example.com",
    updateDatabase: true, // 关键参数：同时更新数据库
  })
);

// 仅更新WebSocket中的用户标识（不影响数据库）
ws.send(
  JSON.stringify({
    type: "set_user_info",
    userId: "user123",
    updateDatabase: false, // 或者省略此参数
  })
);
```

### 2. 实时聊天应用

```javascript
// 加入聊天房间
ws.send(
  JSON.stringify({
    type: "join_room",
    room: "general-chat",
  })
);

// 发送聊天消息
ws.send(
  JSON.stringify({
    type: "room_message",
    content: "Hello everyone!",
  })
);
```

### 3. 实时通知系统

```javascript
// 服务器端广播系统通知
await fetch("/api/ws/broadcast", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    type: "system_notification",
    content: "系统维护将在5分钟后开始",
    data: { level: "warning", duration: 300 },
  }),
});
```

### 4. 实时数据推送

```javascript
// 向特定用户推送数据更新
await fetch("/api/ws/send/user-client-id", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    type: "data_update",
    data: { orderId: 12345, status: "completed" },
  }),
});
```

### 5. 多人协作应用

```javascript
// 文档编辑房间
ws.send(
  JSON.stringify({
    type: "join_room",
    room: "document-123",
  })
);

// 同步编辑操作
ws.send(
  JSON.stringify({
    type: "room_message",
    content: JSON.stringify({
      operation: "insert",
      position: 100,
      text: "Hello World",
    }),
  })
);
```

## 🔧 配置选项

### 心跳检测配置

在 `websocketServer.js` 中可以调整心跳检测间隔：

```javascript
// 默认30秒心跳检测
client.heartbeatInterval = setInterval(() => {
  // ...心跳检测逻辑
}, 30000); // 可以调整这个值
```

### 连接限制配置

可以在 WebSocket 服务器初始化时添加连接数限制：

```javascript
// 在 websocketServer.js 的 handleConnection 方法中添加
if (this.clients.size >= MAX_CONNECTIONS) {
  ws.close(1013, "服务器连接数已满");
  return;
}
```

## 🚨 注意事项

1. **生产环境部署**: 建议使用反向代理（如 Nginx）来处理 WebSocket 连接
2. **安全考虑**: 在生产环境中应添加适当的身份验证和授权机制
3. **性能监控**: 定期监控连接数和消息处理性能
4. **日志记录**: 建议添加详细的日志记录用于调试和监控
5. **错误处理**: 客户端应实现重连机制处理网络中断

## 🤝 扩展开发

### 添加新的消息类型

1. 在 `websocketServer.js` 的 `handleMessage` 方法中添加新的 case
2. 实现相应的处理逻辑
3. 更新客户端代码以支持新消息类型

### 添加身份验证

```javascript
// 在连接建立时验证 token
handleConnection(ws, req) {
    const token = req.url.split('token=')[1];
    if (!validateToken(token)) {
        ws.close(1008, '身份验证失败');
        return;
    }
    // ...正常连接处理
}
```

### 集成数据库

可以将连接信息、消息历史等持久化到数据库中：

```javascript
// 示例：保存消息到数据库
const saveMessage = async (messageData) => {
  await pool.query(
    "INSERT INTO messages (from_client, to_room, content, timestamp) VALUES (?, ?, ?, ?)",
    [messageData.from, messageData.room, messageData.content, new Date()]
  );
};
```

---

🎉 **WebSocket 服务现在已完全配置完成，可以开始使用了！**

如有任何问题或需要进一步的功能扩展，请随时联系开发团队。
