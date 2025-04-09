const processModel = require("../../models/process/index.js");

// 获取流程表
const getProcessTable = async (req, res) => {
  try {
    const users = await processModel.getProcessTableData();
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Database query failed" });
  }
};

module.exports = {
  getProcessTable,
};
