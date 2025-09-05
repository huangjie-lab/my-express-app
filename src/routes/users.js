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
const { getAdSet, addAdSet } = require("../controllers/adSet/index.js");
const { getAdEdit, addAdEdit } = require("../controllers/adEdit/index.js");
const { demo, getAllUsers } = require("../controllers/userController.js");
const router = express.Router();

// 此处挂在对应的路由
router.get("/data", demo);
router.post("/getAllUsers", getAllUsers);
router.get("/getProcess", getProcessTable);
router.post("/addProcess", addProcessTable);
router.get("/delProcess", delProcessTable);
router.post("/editProcess", editProcessTable);
router.get("/getWoot", getWootTable);
router.post("/addWoot", addWootTable);
router.get("/delWoot", delWootTable);
router.post("/editWoot", editWootTable);
router.get("/getBdld", getBdld);
router.post("/addBdld", addBdld);
router.get("/getAdSet", getAdSet);
router.post("/addAdSet", addAdSet);
router.get("/getAdEdit", getAdEdit);
router.post("/addAdEdit", addAdEdit);

module.exports = router;
