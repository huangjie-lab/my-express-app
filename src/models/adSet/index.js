const pool = require("../../config/db.js");
// 获取BDLD活动报名表单
const getAdSetData = async () => {
  const [rows] = await pool.query(`SELECT * FROM advertise_set_table`);
  return rows;
};

const addAdSetData = async (body) => {
  const { wxNum, startDate, endDate, uploadFile, uploadFileName, uploadTime } =
    body;
  const [result] = await pool.query(
    "INSERT INTO bdld_table (wxNum, startDate, endDate, uploadFile, uploadFileName, uploadTime) VALUES (?,?,?,?,?,?)",
    [wxNum, startDate, endDate, uploadFile, uploadFileName, uploadTime]
  );
  return result.insertId;
};

module.exports = {
  getAdSetData,
  addAdSetData,
};
