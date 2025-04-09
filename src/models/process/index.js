const pool = require("../../config/db.js");
// 获取流程表
const getProcessTableData = async () => {
  const [rows] = await pool.query("SELECT * FROM process_table");
  return rows;
};

module.exports = {
  getProcessTableData,
};
