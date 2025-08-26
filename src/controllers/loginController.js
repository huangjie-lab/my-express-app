const loginModel = require("../models/loginModel.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// token密钥
const SECRET_KEY = "your_secret_key";

// 登陆
const login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .send({ error: "Username and password are required." });
  }
  try {
    const existingUser = await loginModel.getUserByUsername({ username });
    if (!existingUser) {
      return res.status(400).send({ error: "Username not exists." });
    }

    if (!bcrypt.compareSync(password, existingUser.password_hash)) {
      return res.status(400).send({
        message: "password error",
      });
    }
    const token = jwt.sign({ userId: existingUser.id }, SECRET_KEY, {
      expiresIn: "1h",
    });
    res.status(201).send({
      message: "login successful!",
      userId: existingUser.id,
      token,
    });
  } catch (error) {
    res.status(500).send({ error: "Server error" });
  }
};

// 注册
const register = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .send({ error: "Username and password are required." });
  }
  try {
    const existingUser = await loginModel.getUserByUsername({ username });
    if (existingUser) {
      return res.status(400).send({ error: "Username already exists." });
    }
    // 加密todo
    const userId = await loginModel.addUser({
      username,
      password: bcrypt.hashSync(password, 10),
    });
    res.status(201).send({
      message: "Registration successful!",
      userId,
    });
  } catch (error) {
    res.status(500).send({ error: "Server error" });
  }
};

module.exports = {
  login,
  register,
};
