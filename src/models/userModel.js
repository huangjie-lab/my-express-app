const pool = require("../config/db.js");

// 创建用户
const createUser = async (name, email) => {
  const [result] = await pool.query(
    "INSERT INTO users (name, email) VALUES (?, ?)",
    [name, email]
  );
  return result.insertId; // 返回新用户的 ID
};

// 根据ID获取用户
const getUserById = async (id) => {
  const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
  return rows[0];
};

// 获取所有用户（支持搜索）
const getAllUsers = async (searchParams = {}, limit = 100, offset = 0) => {
  let query = "SELECT * FROM user_accounts";
  const queryParams = [];
  const whereConditions = [];

  // 构建搜索条件
  if (searchParams.username) {
    whereConditions.push("username LIKE ?");
    queryParams.push(`%${searchParams.username}%`);
  }
  if (searchParams.status !== undefined && searchParams.status !== null) {
    whereConditions.push("status = ?");
    queryParams.push(searchParams.status);
  }
  if (searchParams.role) {
    whereConditions.push("role = ?");
    queryParams.push(searchParams.role);
  }

  // 添加WHERE子句
  if (whereConditions.length > 0) {
    query += " WHERE " + whereConditions.join(" AND ");
  }

  // 添加排序和分页
  query += " ORDER BY created_at DESC LIMIT ? OFFSET ?";
  queryParams.push(limit, offset);

  const [rows] = await pool.query(query, queryParams);
  return rows;
};

// 获取用户总数（支持搜索）
const getUserCount = async (searchParams = {}) => {
  let query = "SELECT COUNT(*) as total FROM user_accounts";
  const queryParams = [];
  const whereConditions = [];

  // 构建搜索条件（与 getAllUsers 保持一致）
  if (searchParams.username) {
    whereConditions.push("username LIKE ?");
    queryParams.push(`%${searchParams.username}%`);
  }
  if (searchParams.status !== undefined && searchParams.status !== null) {
    whereConditions.push("status = ?");
    queryParams.push(searchParams.status);
  }
  if (searchParams.role) {
    whereConditions.push("role = ?");
    queryParams.push(searchParams.role);
  }

  // 添加WHERE子句
  if (whereConditions.length > 0) {
    query += " WHERE " + whereConditions.join(" AND ");
  }

  const [rows] = await pool.query(query, queryParams);
  return rows[0].total;
};

module.exports = {
  createUser,
  getUserById,
  getAllUsers,
  getUserCount,
};
