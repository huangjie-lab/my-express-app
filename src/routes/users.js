const express = require("express");
const { getProcessTable } = require("../controllers/process/index.js");
const { getWootTable } = require("../controllers/woot/index.js");
const { getBdld, addBdld } = require("../controllers/bdld/index.js");
const { demo } = require("../controllers/userController.js");
const router = express.Router();

// 此处挂在对应的路由
router.get("/data", demo);
router.get("/getProcess", getProcessTable);
// router.get("/addProcess", getProcessTable);
// router.get("/delProcess", getProcessTable);
// router.get("/editProcess", getProcessTable);
router.get("/getWoot", getWootTable);
// router.get("/addWoot", getWootTable);
// router.get("/delWoot", getWootTable);
// router.get("/editWoot", getWootTable);
router.get("/getBdld", getBdld);
router.get("/addBdld", addBdld);

module.exports = router;
