const pool = require("../../config/db.js");
// 获取WOOT申报表
const getWootTableData = async () => {
  const [rows] = await pool.query("SELECT * FROM woot_table");
  return rows;
};

// 新增WOOT申报表
const addWootTableData = async (body) => {
  const {
    order_time,
    asin,
    fnsku,
    win,
    brand_name,
    product_title,
    seller_remarks,
    woot_remarks,
    amazon_price,
    bd_price,
    purchase_price,
    actual_quantity,
    return_quantity,
    final_quantity,
    invoice_number,
    plan,
    fba_fee,
    msrp,
    weight,
    length,
    width,
    height,
    quantity,
    customer_id,
    store_name,
    store_email,
    email_notification,
    batteries_included,
    battery_cell_type,
    chemical_composition,
    batteries_number,
    batteries_weight,
    batteries_lithium,
  } = body;
  // const [result] = await pool.query(
  //   `INSERT INTO woot_table (order_time,
  //     asin,
  //     fnsku,
  //     win,
  //     brand_name,
  //     product_title,
  //     seller_remarks,
  //     woot_remarks,
  //     amazon_price,
  //     bd_price,
  //     purchase_price,
  //     actual_quantity,
  //     return_quantity,
  //     final_quantity,
  //     invoice_number,
  //     plan,
  //     fba_fee,
  //     msrp,
  //     weight,
  //     length,
  //     width,
  //     height,
  //     quantity,
  //     customer_id,
  //     store_name,
  //     store_email,
  //     email_notification,
  //     batteries_included,
  //     battery_cell_type,
  //     chemical_composition,
  //     batteries_number,
  //     batteries_weight,
  //     batteries_lithium,) VALUES (?, ?,?, ?,?, ?,?, ?,?, ?,?,?, ?,?, ?,?, ?,?, ?,?, ?,?,?, ?,?, ?,?, ?,?, ?,?, ?,?)`,
  //   [
  //     order_time,
  //     asin,
  //     fnsku,
  //     win,
  //     brand_name,
  //     product_title,
  //     seller_remarks,
  //     woot_remarks,
  //     amazon_price,
  //     bd_price,
  //     purchase_price,
  //     actual_quantity,
  //     return_quantity,
  //     final_quantity,
  //     invoice_number,
  //     plan,
  //     fba_fee,
  //     msrp,
  //     weight,
  //     length,
  //     width,
  //     height,
  //     quantity,
  //     customer_id,
  //     store_name,
  //     store_email,
  //     email_notification,
  //     batteries_included,
  //     battery_cell_type,
  //     chemical_composition,
  //     batteries_number,
  //     batteries_weight,
  //     batteries_lithium,
  //   ]
  // );
  const [result] = await pool.query(
    "INSERT INTO woot_table (order_time,asin,invoice_number,customer_id) VALUES (?, ?,?,?)",
    [order_time, asin, invoice_number, customer_id]
  );
  return result.insertId;
};

// 修改WOOT申报表
const editWootTableData = async (body) => {
  const {
    id,
    order_time,
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
    "UPDATE woot_table SET order_time = ? WHERE id = ?",
    [
      order_time,
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
const delWootTableData = async (id) => {
  const [res] = await pool.query("SELECT * FROM woot_table WHERE id = ?", [id]);
  if (res.length === 0) {
    return false;
  }
  const [rows] = await pool.query("DELETE FROM woot_table WHERE id = ?", [id]);
  return rows;
};
module.exports = {
  getWootTableData,
  addWootTableData,
  editWootTableData,
  delWootTableData,
};
