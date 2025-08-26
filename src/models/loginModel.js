const pool = require("../config/db.js");

// 根据username查询用户
const getUserByUsername = async ({ username }) => {
  const [rows] = await pool.query(
    "SELECT * FROM user_accounts WHERE username = ?",
    [username]
  );
  return rows[0];
};

const addUser = async ({ username, password }) => {
  const [result] = await pool.query(
    "INSERT INTO user_accounts (username, password_hash, created_at) VALUES (?, ?, ?)",
    [username, password, new Date()]
  );
  return result.insertId;
};

module.exports = {
  addUser,
  getUserByUsername,
};
