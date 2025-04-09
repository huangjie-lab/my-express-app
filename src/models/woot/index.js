const pool = require("../../config/db.js");
// 获取WOOT申报表
const getWootTableData = async () => {
  const [rows] = await pool.query("SELECT * FROM woot_table");
  return rows;
};

module.exports = {
  getWootTableData,
};
