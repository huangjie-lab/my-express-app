const express = require("express");
const { getUsers, addUser, demo } = require("../controllers/userController.js");
const router = express.Router();

// 此处挂在对应的路由
router.get("/data", demo);
router.get("/getUsers", getUsers);
router.get("/addUser", addUser);

module.exports = router;
