import mysql from "mysql2/promise"; // 使用 Promise 版本

// 创建连接池（推荐生产环境使用）
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || "localhost",
  user: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_PASSWORD || "Wxy1314250@_",
  database: process.env.MYSQL_DATABASE || "myapp",
  waitForConnections: true,
  connectionLimit: 10, // 最大连接数
  queueLimit: 0, // 无排队限制
});

export default pool;
