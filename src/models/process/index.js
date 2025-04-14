const pool = require("../../config/db.js");
// 获取流程表
const getProcessTableData = async (LIMIT, OFFSET, NAME) => {
  let sql = `SELECT * FROM process_table LIMIT ${LIMIT} OFFSET ${OFFSET}`;
  if (NAME) {
    sql = `SELECT * FROM process_table WHERE name LIKE "%${NAME}%" LIMIT ${LIMIT} OFFSET ${OFFSET}`;
  }
  const [rows] = await pool.query(sql);
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
    address,
    bank_account,
    bank_address,
    bank_name,
    company_address,
    company_english,
    email,
    is_platform,
    name,
    pay,
    pay_name,
    phone,
    phone_name,
    routing,
    swift_code,
    wechat,
  } = body;
  const [result] = await pool.query(
    `UPDATE process_table SET 
      company_name = ?,
      address = ?,
      bank_account = ?,
      bank_address = ?,
      bank_name = ?,
      company_address = ?,
      company_english=?, 
      email=?, 
      is_platform=?, 
      name=?, 
      pay=?,
      pay_name=?,
      phone=?,
      phone_name=?,
      routing=?,
      swift_code=?,
      wechat=?
      WHERE id = ?`,
    [
      company_name,
      address,
      bank_account,
      bank_address,
      bank_name,
      company_address,
      company_english,
      email,
      is_platform,
      name,
      pay,
      pay_name,
      phone,
      phone_name,
      routing,
      swift_code,
      wechat,
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
