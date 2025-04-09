const wootModel = require("../../models/woot/index");
// 获取WOOT申报表
const getWootTable = async (req, res) => {
  try {
    const users = await wootModel.getWootTableData();
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Database query failed" });
  }
};

module.exports = {
  getWootTable,
};
