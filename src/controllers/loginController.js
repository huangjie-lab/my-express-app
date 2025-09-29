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
    const token = jwt.sign({ userId: existingUser.user_id }, JWT_SECRET, {
      expiresIn: "1h",
    });
    if (existingUser.status === 0) {
      return res.status(400).send({
        message: "用户已禁用",
        success: false,
      });
    }
    res.status(201).send({
      data: {
        user_id: existingUser.user_id,
        username: existingUser.username,
        email: existingUser.email,
        img: existingUser.img,
        role: existingUser.role,
        status: existingUser.status,
      },
      message: "登录成功",
      token,
      success: true,
    });
  } catch (error) {
    res.status(500).send({ error: "Server error" });
  }
};

// 注册
const register = async (req, res) => {
  const { username, password, email } = req.body;
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
      email,
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

// 修改用户信息
const updateUser = async (req, res) => {
  try {
    // 从FormData获取字段（文本字段在req.body，文件在req.file）
    const { user_id, username, email, password, role, status, img } = req.body;

    // 验证必填字段
    if (!user_id) {
      return res.status(400).send({
        error: "参数错误",
        message: "user_id为必填字段",
      });
    }

    // 检查用户是否存在
    const existingUser = await loginModel.getUserById(user_id);
    if (!existingUser) {
      return res.status(404).send({
        error: "用户不存在",
        message: `未找到user_id为${user_id}的用户`,
      });
    }

    if (username) {
      // 如果用户名有变化，检查新用户名是否已存在
      if (username !== existingUser.username) {
        const usernameExists = await loginModel.isUsernameExists(
          username,
          user_id
        );
        if (usernameExists) {
          return res.status(400).send({
            error: "用户名已存在",
            message: `用户名"${username}"已被使用，请选择其他用户名`,
          });
        }
      }
    }

    // 调用Model层更新用户信息
    const updateData = {};
    if (email !== undefined) updateData.email = email;
    if (username !== undefined) updateData.username = username;
    if (role !== undefined) updateData.role = role;
    if (status !== undefined) updateData.status = status;
    // 处理图片上传
    if (img !== undefined) {
      updateData.img = img;
    }

    // 添加密码修改逻辑
    if (password) {
      const saltRounds = 10;
      updateData.password_hash = bcrypt.hashSync(password, saltRounds);
    }

    const isUpdated = await loginModel.updateUser(user_id, updateData);

    if (isUpdated) {
      // 获取更新后的用户信息
      const updatedUser = await loginModel.getUserById(user_id);
      res.status(200).send({
        message: "用户信息更新成功",
        data: {
          user_id: updatedUser.user_id,
          username: updatedUser.username,
          email: updatedUser.email,
          img: updatedUser.img,
          role: updatedUser.role,
          status: updatedUser.status,
        },
        success: true,
      });
    } else {
      res.status(500).send({
        error: "更新失败",
        message: "未能更新用户信息，请稍后重试",
      });
    }
  } catch (error) {
    res.status(500).send({
      error: "服务器错误",
      details: error.message,
    });
  }
};

module.exports = {
  login,
  register,
  updateUser,
};
