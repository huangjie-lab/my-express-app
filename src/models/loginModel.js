const pool = require("../config/db.js");
const { v4: uuidv4 } = require("uuid");

// 根据username查询用户
const getUserByUsername = async ({ username }) => {
  const [rows] = await pool.query(
    "SELECT * FROM user_accounts WHERE username = ?",
    [username]
  );
  return rows[0];
};

const addUser = async ({ username, password, email }) => {
  const user_id = uuidv4(); // 生成UUID作为user_id
  const [result] = await pool.query(
    "INSERT INTO user_accounts (user_id, email, username, password_hash, created_at) VALUES (?, ?,?, ?, ?)",
    [user_id, email, username, password, new Date()]
  );
  return user_id; // 返回生成的user_id
};

// 根据用户ID查询用户
const getUserById = async (userId) => {
  const [rows] = await pool.query(
    "SELECT * FROM user_accounts WHERE user_id = ?",
    [userId]
  );
  return rows[0];
};

// 检查用户名是否已存在（排除当前用户）
const isUsernameExists = async (username, excludeUserId) => {
  const [rows] = await pool.query(
    "SELECT * FROM user_accounts WHERE username = ? AND user_id != ?",
    [username, excludeUserId]
  );
  return rows.length > 0;
};

// 更新用户信息
const updateUser = async (userId, userData) => {
  // 构建更新数据对象
  const updateFields = {};
  if (userData.username !== undefined)
    updateFields.username = userData.username;
  if (userData.email !== undefined) updateFields.email = userData.email;
  if (userData.img !== undefined) updateFields.img = userData.img;
  // 添加密码字段支持
  if (userData.password_hash !== undefined)
    updateFields.password_hash = userData.password_hash;

  // 如果没有需要更新的字段，直接返回false
  if (Object.keys(updateFields).length === 0) {
    return false;
  }

  // 构建SQL更新语句
  const fields = Object.keys(updateFields);
  const setClause = fields.map((field) => `${field} = ?`).join(", ");
  const values = [...fields.map((field) => updateFields[field]), userId];

  const [result] = await pool.query(
    `UPDATE user_accounts SET ${setClause} WHERE user_id = ?`,
    values
  );

  return result.affectedRows > 0;
};

module.exports = {
  addUser,
  getUserByUsername,
  getUserById,
  isUsernameExists,
  updateUser,
};
