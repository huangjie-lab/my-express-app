const pool = require("../../config/db.js");
// 获取BDLD活动报名表单
const getBdldData = async () => {
  const [rows] = await pool.query("SELECT * FROM bdld_table");
  return rows;
};

module.exports = {
  getBdldData,
};
