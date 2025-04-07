import * as userModel from "../models/userModel.js";

// 获取所有用户
export const getUsers = async (req, res) => {
  try {
    const users = await userModel.getAllUsers();
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Database query failed" });
  }
};

// 创建用户
export const addUser = async (req, res) => {
  const { name, email } = req.query;

  console.log(name, email, "name, email");

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
