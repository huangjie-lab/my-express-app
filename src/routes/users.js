const express = require("express");
const { getUsers, addUser } = require("../controllers/userController.js");
const router = express.Router();

// 此处挂在对应的路由
// router.get("/getUser", (req, res) => {
//   res.send("Express 服务已运行");
// });

router.get("/getUsers", getUsers);
router.get("/addUser", addUser);

module.exports = router;
