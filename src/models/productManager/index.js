const pool = require("../../config/db.js");

const getAllProductData = async (searchParams, limit, offset) => {
  let query = "SELECT * FROM product_management";
  const queryParams = [];
  const whereConditions = [];

  // 构建搜索条件
  if (searchParams.asin) {
    whereConditions.push("asin = ?");
    queryParams.push(searchParams.asin);
  }
  if (searchParams.fnsku) {
    whereConditions.push("fnsku = ?");
    queryParams.push(searchParams.fnsku);
  }
  if (searchParams.title) {
    whereConditions.push("title LIKE ?");
    queryParams.push(`%${searchParams.title}%`);
  }
  if (searchParams.product_name) {
    whereConditions.push("product_name LIKE ?");
    queryParams.push(`%${searchParams.product_name}%`);
  }
  if (searchParams.brand) {
    whereConditions.push("brand LIKE ?");
    queryParams.push(`%${searchParams.brand}%`);
  }
  if (searchParams.store_name) {
    whereConditions.push("store_name LIKE ?");
    queryParams.push(`%${searchParams.store_name}%`);
  }
  if (searchParams.win_status !== undefined) {
    whereConditions.push("win_status = ?");
    queryParams.push(searchParams.win_status);
  }
  if (searchParams.status) {
    whereConditions.push("status = ?");
    queryParams.push(searchParams.status);
  }

  // 添加WHERE子句
  if (whereConditions.length > 0) {
    query += " WHERE " + whereConditions.join(" AND ");
  }

  // 添加分页
  query += " LIMIT ? OFFSET ?";
  queryParams.push(limit, offset);

  const [rows] = await pool.query(query, queryParams);
  return rows;
};

// 新增产品数据 - 根据实际表结构调整
const createProductData = async (productData) => {
  const {
    asin,
    fnsku,
    brand,
    title,
    product_name,
    remark,
    shipping_method,
    campaign_method,
    transparent_program,
    hold_price,
    bd_price,
    msrp_price,
    fba_fee,
    amz_commission,
    purchase_price,
    inventory_quantity,
    weight,
    length,
    width,
    height,
    has_battery,
    battery_type,
    battery_capacity,
    store_id,
    store_name,
    store_email,
    win_status,
    status,
    submit_time,
    invoice_number,
    purchase_quantity,
  } = productData;

  const query = `INSERT INTO product_management (
    asin, fnsku, brand, title, product_name, remark, 
    shipping_method, campaign_method, transparent_program, 
    hold_price, bd_price, msrp_price, fba_fee, amz_commission, purchase_price, 
    inventory_quantity, weight, length, width, height, 
    has_battery, battery_type, battery_capacity, 
    store_id, store_name, store_email, 
    win_status, status, submit_time, invoice_number, purchase_quantity
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const [result] = await pool.query(query, [
    asin,
    fnsku,
    brand,
    title,
    product_name,
    remark,
    shipping_method,
    campaign_method,
    transparent_program,
    hold_price,
    bd_price,
    msrp_price,
    fba_fee,
    amz_commission,
    purchase_price,
    inventory_quantity,
    weight,
    length,
    width,
    height,
    has_battery,
    battery_type,
    battery_capacity,
    store_id,
    store_name,
    store_email,
    win_status,
    status,
    submit_time,
    invoice_number,
    purchase_quantity,
  ]);

  return { id: result.insertId, ...productData };
};

// 删除产品数据
const deleteProductData = async (id) => {
  const query = "DELETE FROM product_management WHERE id = ?";
  const [result] = await pool.query(query, [id]);
  return result.affectedRows > 0;
};

// 更新产品数据
const updateProductData = async (id, productData) => {
  // 动态构建更新字段和参数
  const fields = Object.keys(productData);
  if (fields.length === 0) return false;

  const setClause = fields.map((field) => `${field} = ?`).join(", ");
  const query = `UPDATE product_management SET ${setClause} WHERE id = ?`;
  const values = [...fields.map((field) => productData[field]), id];

  const [result] = await pool.query(query, values);
  return result.affectedRows > 0;
};

module.exports = {
  getAllProductData,
  createProductData,
  deleteProductData,
  updateProductData,
};
