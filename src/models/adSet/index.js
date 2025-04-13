const pool = require("../../config/db.js");
// 获取BDLD活动报名表单
const getAdSetData = async () => {
  const [rows] = await pool.query(`SELECT * FROM advertise_set_table`);
  return rows;
};

const addAdSetData = async (body) => {
  const { wxNum, startDate, endDate } = body;
  console.log(wxNum, startDate, endDate, "wxNum, startDate, endDate");

  const [result] = await pool.query(
    "INSERT INTO advertise_set_table (wxNum, startDate, endDate) VALUES (?,?,?)",
    [wxNum, startDate, endDate]
  );
  return result.insertId;
};

module.exports = {
  getAdSetData,
  addAdSetData,
};
