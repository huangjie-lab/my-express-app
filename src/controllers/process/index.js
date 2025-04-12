const processModel = require("../../models/process/index.js");

// 获取流程表
const getProcessTable = async (req, res) => {
  const { page, pageSize } = req.query;
  const limit = pageSize;
  const offset = (page - 1) * pageSize;
  try {
    const users = await processModel.getProcessTableData(limit, offset);
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Database query failed" });
  }
};

// 新增流程表
const addProcessTable = async (req, res) => {
  // 此处校验req.body非空
  try {
    const id = await processModel.addProcessTableData(req.body);
    res.json({ success: true, id });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Error" });
  }
};

// 修改流程表
const editProcessTable = async (req, res) => {
  // 此处校验req.body非空
  try {
    const result = await processModel.editProcessTableData(req.body);
    console.log(result, "resultresult");
    res.json({ success: true });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Error" });
  }
};

// 删除流程表
const delProcessTable = async (req, res) => {
  const { id } = req.query;
  try {
    const result = await processModel.delProcessTableData(id);
    // id不存在
    if (result === false) {
      res.json({ error: "Error" });
    }
    res.json({ success: true });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Error" });
  }
};

module.exports = {
  getProcessTable,
  addProcessTable,
  editProcessTable,
  delProcessTable,
};
