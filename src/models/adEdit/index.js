const pool = require("../../config/db.js");
// 获取BDLD活动报名表单
const getAdEditData = async (LIMIT, OFFSET) => {
  const [rows] = await pool.query(`SELECT * FROM advertise_edit_table`);
  return rows;
};

const addAdEditData = async (body) => {
  const { wxNum, type } = body;
  const [result] = await pool.query(
    "INSERT INTO advertise_edit_table (wxNum, type) VALUES (?,?)",
    [wxNum, type]
  );
  return result.insertId;
};
module.exports = {
  getAdEditData,
  addAdEditData,
};
