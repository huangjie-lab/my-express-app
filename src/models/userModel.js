const pool = require("../config/db.js");

// 获取所有用户
const getAllUsers = async () => {
  const [rows] = await pool.query("SELECT * FROM users");
  return rows;
};

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

module.exports = {
  getAllUsers,
  createUser,
  getUserById,
};
