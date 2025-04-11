const mysql = require("mysql2/promise"); // 使用 Promise 版本

// 创建连接池（推荐生产环境使用）
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Wxy1314250@_",
  database: "myqpp",
  waitForConnections: true,
  connectionLimit: 10, // 最大连接数
  queueLimit: 0, // 无排队限制
});

module.exports = pool;
