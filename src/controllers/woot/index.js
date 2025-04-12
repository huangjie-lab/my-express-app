const wootModel = require("../../models/woot/index");
// 获取WOOT申报表
const getWootTable = async (req, res) => {
  const { page, pageSize } = req.query;
  const limit = pageSize;
  const offset = (page - 1) * pageSize;
  try {
    const users = await wootModel.getWootTableData(limit, offset);
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Database query failed" });
  }
};
// 新增WOOT申报表
const addWootTable = async (req, res) => {
  // 此处校验req.body非空
  try {
    const result = await wootModel.addWootTableData(req.body);
    console.log(result, "resultresult");
    res.json({ success: true });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Error" });
  }
};
// 修改WOOT申报表
const editWootTable = async (req, res) => {
  // 此处校验req.body非空
  try {
    const result = await wootModel.editWootTableData(req.body);
    console.log(result, "resultresult");
    res.json({ success: true });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Error" });
  }
};
// 删除流程表
const delWootTable = async (req, res) => {
  const { id } = req.query;
  try {
    const result = await wootModel.delWootTableData(id);
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
  getWootTable,
  addWootTable,
  editWootTable,
  delWootTable,
};
