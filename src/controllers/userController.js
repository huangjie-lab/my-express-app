const userModel = require("../models/userModel.js");

const demo = (req, res) => {
  res.json({ message: "Hello from Express!" });
};

// 创建用户
const addUser = async (req, res) => {
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

module.exports = {
  addUser,
  demo,
};
