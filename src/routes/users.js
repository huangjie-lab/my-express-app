const express = require("express");
const {
  getProcessTable,
  addProcessTable,
  editProcessTable,
  delProcessTable,
} = require("../controllers/process/index.js");
const {
  getWootTable,
  addWootTable,
  editWootTable,
  delWootTable,
} = require("../controllers/woot/index.js");
const { getBdld, addBdld } = require("../controllers/bdld/index.js");
const { demo } = require("../controllers/userController.js");
const router = express.Router();

// 此处挂在对应的路由
router.get("/data", demo);
router.get("/getProcess", getProcessTable);
router.post("/addProcess", addProcessTable);
router.get("/delProcess", delProcessTable);
router.post("/editProcess", editProcessTable);
router.get("/getWoot", getWootTable);
router.post("/addWoot", addWootTable);
router.get("/delWoot", delWootTable);
router.post("/editWoot", editWootTable);
router.get("/getBdld", getBdld);
router.get("/addBdld", addBdld);

module.exports = router;
