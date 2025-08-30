const loginModel = require("../models/loginModel.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../middleware/auth.js");

// 登陆
const login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).send({ error: "用户名或密码不能为空" });
  }
  try {
    const existingUser = await loginModel.getUserByUsername({ username });
    if (!existingUser) {
      return res.status(400).send({ error: "用户名不存在" });
    }

    if (!bcrypt.compareSync(password, existingUser.password_hash)) {
      return res.status(400).send({
        message: "密码错误",
      });
    }
    const token = jwt.sign({ userId: existingUser.id }, JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(201).send({
      message: "登录成功",
      userId: existingUser.id,
      token,
      username,
      success: true,
    });
  } catch (error) {
    res.status(500).send({ error: "Server error" });
  }
};

// 注册
const register = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).send({ error: "用户名或密码不能为空" });
  }
  try {
    const existingUser = await loginModel.getUserByUsername({ username });
    if (existingUser) {
      return res.status(400).send({ error: "用户名已存在" });
    }
    // 加密todo
    const userId = await loginModel.addUser({
      username,
      password: bcrypt.hashSync(password, 10),
    });
    res.status(201).send({
      message: "注册成功",
      userId,
      success: true,
    });
  } catch (error) {
    res.status(500).send({ error: "Server error" });
  }
};

module.exports = {
  login,
  register,
};
