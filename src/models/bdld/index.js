const pool = require("../../config/db.js");
// 获取BDLD活动报名表单
const getBdldData = async () => {
  const [rows] = await pool.query("SELECT * FROM bdld_table");
  return rows;
};

const addBdldData = async (body) => {
  const {
    wx_num,
    type,
    start_date,
    end_date,
    bd_time,
    write_time,
    title,
    asin,
    win,
    bdld_sales,
  } = body;
  const [result] = await pool.query(
    "INSERT INTO bdld_table (wx_num,type,start_date,end_date,bd_time,write_time,title,asin,win,bdld_sales) VALUES (?,?,?,?,?,?,?,?,?,?)",
    [
      wx_num,
      type,
      start_date,
      end_date,
      bd_time,
      write_time,
      title,
      asin,
      win,
      bdld_sales,
    ]
  );
  return result.insertId;
};

module.exports = {
  getBdldData,
  addBdldData,
};
