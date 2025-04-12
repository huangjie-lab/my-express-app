const pool = require("../../config/db.js");
// 获取流程表
const getProcessTableData = async (LIMIT, OFFSET) => {
  const [rows] = await pool.query(
    `SELECT * FROM process_table LIMIT ${LIMIT} OFFSET ${OFFSET}`
  );
  return rows;
};

// 新增流程表
const addProcessTableData = async (body) => {
  const {
    company_name,
    name,
    phone_name,
    phone,
    wechat,
    address,
    email,
    pay,
    pay_name,
    is_platform,
    company_english,
  } = body;
  const [result] = await pool.query(
    "INSERT INTO process_table (company_name, name,phone_name,phone, wechat,address,email,pay,pay_name,is_platform,company_english) VALUES (?, ?,?, ?,?, ?,?, ?,?, ?,?)",
    [
      company_name,
      name,
      phone_name,
      phone,
      wechat,
      address,
      email,
      pay,
      pay_name,
      is_platform,
      company_english,
    ]
  );
  return result.insertId;
};

// 修改流程表
const editProcessTableData = async (body) => {
  const {
    id,
    company_name,
    // name,
    // phone_name,
    // phone,
    // wechat,
    // address,
    // email,
    // pay,
    // pay_name,
    // is_platform,
    // company_english,
  } = body;
  const [result] = await pool.query(
    // "UPDATE process_table SET company_name = ?, name = ?, phone_name = ?,phone = ?,wechat = ?,address = ?,email = ?,pay = ?,pay_name = ?,is_platform = ?,company_english = ? WHERE id = ?",
    "UPDATE process_table SET company_name = ? WHERE id = ?",
    [
      company_name,
      // name,
      // phone_name,
      // phone,
      // wechat,
      // address,
      // email,
      // pay,
      // pay_name,
      // is_platform,
      // company_english,
      id,
    ]
  );
  return result;
};

// 删除流程表
const delProcessTableData = async (id) => {
  const [res] = await pool.query("SELECT * FROM process_table WHERE id = ?", [
    id,
  ]);
  if (res.length === 0) {
    return false;
  }
  const [rows] = await pool.query("DELETE FROM process_table WHERE id = ?", [
    id,
  ]);
  return rows;
};
module.exports = {
  getProcessTableData,
  addProcessTableData,
  editProcessTableData,
  delProcessTableData,
};
