const pool = require("../../config/db.js");
// 获取BDLD活动报名表单
const getAdEditData = async (LIMIT, OFFSET) => {
  const [rows] = await pool.query(`SELECT * FROM advertise_edit_table`);
  return rows;
};

const addAdEditData = async (body) => {
  const { wxNum, rule, uploadFile, uploadFileName, uploadTime } = body;
  const [result] = await pool.query(
    "INSERT INTO bdld_table (wxNum, rule, uploadFile, uploadFileName, uploadTime) VALUES (?,?,?,?,?)",
    [wxNum, rule, uploadFile, uploadFileName, uploadTime]
  );
  return result.insertId;
};
module.exports = {
  getAdEditData,
  addAdEditData,
};
