const userModel = require("../models/userModel.js");

const demo = (req, res) => {
  res.json({ message: "Hello from Express!" });
};

// 创建用户
const addUser = async (req, res) => {
  const { name, email } = req.query;

  if (!name || !email) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const userId = await userModel.createUser(name, email);
    res.status(201).json({ id: userId, name, email });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "Email already exists" });
    }
    console.error("Error creating user:", err);
    res.status(500).json({ error: "Failed to create user" });
  }
};

// 获取所有用户（支持分页和搜索）
const getAllUsers = async (req, res) => {
  try {
    // 获取分页参数
    const page = parseInt(req.body.page) || 1;
    const pageSize = parseInt(req.body.pageSize) || 10;
    const offset = (page - 1) * pageSize;
    const limit = pageSize;

    // 获取搜索参数
    const searchParams = {
      username: req.body.username,
      status:
        req.body.status !== undefined ? parseInt(req.body.status) : undefined,
      role: req.body.role,
    };

    // 过滤掉undefined的搜索参数
    Object.keys(searchParams).forEach((key) => {
      if (searchParams[key] === undefined) {
        delete searchParams[key];
      }
    });

    // 获取用户列表和总数
    const [users, total] = await Promise.all([
      userModel.getAllUsers(searchParams, limit, offset),
      userModel.getUserCount(searchParams),
    ]);

    res.status(200).json({
      success: true,
      data: users,
      total,
    });
  } catch (error) {
    console.error("Error getting all users:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get users",
      message: error.message,
    });
  }
};

module.exports = {
  addUser,
  demo,
  getAllUsers,
};
