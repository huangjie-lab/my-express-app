const pool = require("../config/db.js");

// 格式化日期为 YYYY-MM-DD HH:MM:SS
const formatDateTime = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const seconds = String(d.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

// 获取所有核价数据（支持搜索）
const getAllCheckPrice = async (searchParams = {}, limit = 100, offset = 0) => {
  let query = `
    SELECT cp.*, 
           COALESCE((
             SELECT SUM(COALESCE(cp2.pickup_quantity, 0)) 
             FROM check_price cp2 
             WHERE cp2.customer_id = cp.customer_id
           ), 0) as accumulatedQuantity 
    FROM check_price cp
  `;
  const queryParams = [];
  const whereConditions = [];

  // 构建搜索条件
  if (searchParams.customer_id) {
    whereConditions.push("cp.customer_id LIKE ?");
    queryParams.push(`%${searchParams.customer_id}%`);
  }
  if (searchParams.asin) {
    whereConditions.push("cp.asin = ?");
    queryParams.push(searchParams.asin);
  }
  if (searchParams.fnsku) {
    whereConditions.push("cp.fnsku = ?");
    queryParams.push(searchParams.fnsku);
  }
  if (searchParams.brand) {
    whereConditions.push("cp.brand LIKE ?");
    queryParams.push(`%${searchParams.brand}%`);
  }
  if (searchParams.win) {
    whereConditions.push("cp.win LIKE ?");
    queryParams.push(`%${searchParams.win}%`);
  }
  if (searchParams.activity_start_date) {
    whereConditions.push("cp.activity_start_date >= ?");
    queryParams.push(searchParams.activity_start_date);
  }
  if (searchParams.activity_end_date) {
    whereConditions.push("cp.activity_end_date <= ?");
    queryParams.push(searchParams.activity_end_date);
  }
  if (searchParams.total_quantity) {
    whereConditions.push("cp.total_quantity >= ?");
    queryParams.push(searchParams.total_quantity);
  }
  if (searchParams.activity_submission_date) {
    whereConditions.push("cp.activity_submission_date >= ?");
    queryParams.push(searchParams.activity_submission_date);
  }
  if (searchParams.requestedQuantity) {
    whereConditions.push("cp.requestedQuantity >= ?");
    queryParams.push(searchParams.requestedQuantity);
  }
  if (searchParams.group_id) {
    whereConditions.push("cp.group_id = ?");
    queryParams.push(searchParams.group_id);
  }
  if (searchParams.activity_type) {
    whereConditions.push("cp.activity_type LIKE ?");
    queryParams.push(`%${searchParams.activity_type}%`);
  }
  if (searchParams.customer_name) {
    whereConditions.push("cp.customer_name LIKE ?");
    queryParams.push(`%${searchParams.customer_name}%`);
  }
  if (searchParams.customer_request) {
    whereConditions.push("cp.customer_request LIKE ?");
    queryParams.push(`%${searchParams.customer_request}%`);
  }
  if (searchParams.adjusted_bd_price) {
    whereConditions.push("cp.adjusted_bd_price >= ?");
    queryParams.push(searchParams.adjusted_bd_price);
  }
  if (searchParams.adjusted_purchase_price) {
    whereConditions.push("cp.adjusted_purchase_price >= ?");
    queryParams.push(searchParams.adjusted_purchase_price);
  }
  if (searchParams.adjustment_time) {
    whereConditions.push("cp.adjustment_time >= ?");
    queryParams.push(searchParams.adjustment_time);
  }

  // 添加WHERE子句
  if (whereConditions.length > 0) {
    query += " WHERE " + whereConditions.join(" AND ");
  }

  // 添加排序和分页
  query += " ORDER BY cp.created_at DESC LIMIT ? OFFSET ?";
  queryParams.push(limit, offset);

  const [rows] = await pool.query(query, queryParams);
  return rows;
};

// 获取核价数据总数（支持搜索）
const getCheckPriceCount = async (searchParams = {}) => {
  let query = "SELECT COUNT(*) as total FROM check_price";
  const queryParams = [];
  const whereConditions = [];

  // 构建搜索条件（与 getAllCheckPrice 保持一致）
  if (searchParams.customer_id) {
    whereConditions.push("customer_id LIKE ?");
    queryParams.push(`%${searchParams.customer_id}%`);
  }
  if (searchParams.asin) {
    whereConditions.push("asin = ?");
    queryParams.push(searchParams.asin);
  }
  if (searchParams.fnsku) {
    whereConditions.push("fnsku = ?");
    queryParams.push(searchParams.fnsku);
  }
  if (searchParams.brand) {
    whereConditions.push("brand LIKE ?");
    queryParams.push(`%${searchParams.brand}%`);
  }
  if (searchParams.win) {
    whereConditions.push("win LIKE ?");
    queryParams.push(`%${searchParams.win}%`);
  }
  if (searchParams.activity_start_date) {
    whereConditions.push("activity_start_date >= ?");
    queryParams.push(searchParams.activity_start_date);
  }
  if (searchParams.activity_end_date) {
    whereConditions.push("activity_end_date <= ?");
    queryParams.push(searchParams.activity_end_date);
  }
  if (searchParams.total_quantity) {
    whereConditions.push("total_quantity >= ?");
    queryParams.push(searchParams.total_quantity);
  }
  if (searchParams.activity_submission_date) {
    whereConditions.push("activity_submission_date >= ?");
    queryParams.push(searchParams.activity_submission_date);
  }
  if (searchParams.requestedQuantity) {
    whereConditions.push("requestedQuantity >= ?");
    queryParams.push(searchParams.requestedQuantity);
  }
  if (searchParams.group_id) {
    whereConditions.push("group_id = ?");
    queryParams.push(searchParams.group_id);
  }
  if (searchParams.activity_type) {
    whereConditions.push("activity_type LIKE ?");
    queryParams.push(`%${searchParams.activity_type}%`);
  }
  if (searchParams.customer_name) {
    whereConditions.push("customer_name LIKE ?");
    queryParams.push(`%${searchParams.customer_name}%`);
  }
  if (searchParams.customer_request) {
    whereConditions.push("customer_request LIKE ?");
    queryParams.push(`%${searchParams.customer_request}%`);
  }
  if (searchParams.adjusted_bd_price) {
    whereConditions.push("adjusted_bd_price >= ?");
    queryParams.push(searchParams.adjusted_bd_price);
  }
  if (searchParams.adjusted_purchase_price) {
    whereConditions.push("adjusted_purchase_price >= ?");
    queryParams.push(searchParams.adjusted_purchase_price);
  }
  if (searchParams.adjustment_time) {
    whereConditions.push("adjustment_time >= ?");
    queryParams.push(searchParams.adjustment_time);
  }

  // 添加WHERE子句
  if (whereConditions.length > 0) {
    query += " WHERE " + whereConditions.join(" AND ");
  }

  const [rows] = await pool.query(query, queryParams);
  return rows[0]?.total || 0;
};

// 根据ID获取核价数据
const getCheckPriceById = async (id) => {
  const [rows] = await pool.query(
    `
    SELECT cp.*, 
           COALESCE((
             SELECT SUM(COALESCE(cp2.pickup_quantity, 0)) 
             FROM check_price cp2 
             WHERE cp2.customer_id = cp.customer_id
           ), 0) as accumulatedQuantity 
    FROM check_price cp 
    WHERE cp.id = ?
  `,
    [id]
  );
  return rows[0];
};

// 创建核价数据
const createCheckPrice = async (checkPriceData) => {
  const {
    customer_id,
    asin,
    win,
    fnsku,
    brand,
    product_name,
    title,
    shipping_method,
    promotion_method,
    hold_price,
    bd_price,
    initial_review_price,
    final_review_price,
    purchase_price,
    pricing_benchmark,
    woot_notes,
    msrp_price,
    inventory_quantity,
    actual_quantity,
    invoice_number,
    transparent_program,
    amz_commission,
    fba_shipping_fee,
    weight,
    length,
    width,
    height,
    store_id,
    store_name,
    store_email,
    submission_time,
    has_battery,
    battery_type,
    battery_capacity,
    status,
    initial_purchase_price,
    final_purchase_price,
    activity_start_date,
    activity_end_date,
    total_quantity,
    activity_submission_date,
    requestedQuantity,
    group_id,
    activity_type,
    adjusted_bd_price,
    adjusted_purchase_price,
    adjustment_time,
    customer_name,
    customer_request,
  } = checkPriceData;

  const query = `INSERT INTO check_price (
    customer_id, asin, win, fnsku, brand, product_name, title, 
    shipping_method, promotion_method, hold_price, bd_price, 
    initial_review_price, final_review_price, purchase_price, 
    pricing_benchmark, woot_notes, msrp_price, inventory_quantity, 
    actual_quantity, invoice_number, transparent_program, 
    amz_commission, fba_shipping_fee, weight, length, width, height, 
    store_id, store_name, store_email, submission_time, 
    has_battery, battery_type, battery_capacity, status,
    initial_purchase_price, final_purchase_price, activity_start_date,
    activity_end_date, total_quantity, activity_submission_date, requestedQuantity,
    group_id, activity_type, adjusted_bd_price, adjusted_purchase_price,
    adjustment_time, customer_name, customer_request
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const [result] = await pool.query(query, [
    customer_id,
    asin,
    win,
    fnsku,
    brand,
    product_name,
    title,
    shipping_method,
    promotion_method,
    hold_price,
    bd_price,
    initial_review_price,
    final_review_price,
    purchase_price,
    pricing_benchmark,
    woot_notes,
    msrp_price,
    inventory_quantity,
    actual_quantity,
    invoice_number,
    transparent_program,
    amz_commission,
    fba_shipping_fee,
    weight,
    length,
    width,
    height,
    store_id,
    store_name,
    store_email,
    submission_time || formatDateTime(new Date()),
    has_battery,
    battery_type,
    battery_capacity,
    status,
    initial_purchase_price,
    final_purchase_price,
    activity_start_date,
    activity_end_date,
    total_quantity,
    activity_submission_date,
    requestedQuantity,
    group_id,
    activity_type,
    adjusted_bd_price,
    adjusted_purchase_price,
    adjustment_time || formatDateTime(new Date()),
    customer_name,
    customer_request,
  ]);

  return { id: result.insertId, ...checkPriceData };
};

// 更新核价数据
const updateCheckPrice = async (id, checkPriceData) => {
  // 动态构建更新字段和参数
  const fields = Object.keys(checkPriceData);
  if (fields.length === 0) return false;

  const setClause = fields.map((field) => `${field} = ?`).join(", ");
  const query = `UPDATE check_price SET ${setClause} WHERE id = ?`;
  const values = [...fields.map((field) => checkPriceData[field]), id];

  const [result] = await pool.query(query, values);
  return result.affectedRows > 0;
};

// 删除核价数据
const deleteCheckPrice = async (id) => {
  const query = "DELETE FROM check_price WHERE id = ?";
  const [result] = await pool.query(query, [id]);
  return result.affectedRows > 0;
};

// 获取所有核价数据用于导出（无分页限制，支持搜索）
const getAllCheckPriceForExport = async (searchParams = {}) => {
  let query = `
    SELECT cp.*, 
           COALESCE((
             SELECT SUM(COALESCE(cp2.pickup_quantity, 0)) 
             FROM check_price cp2 
             WHERE cp2.customer_id = cp.customer_id
           ), 0) as accumulatedQuantity 
    FROM check_price cp
  `;
  const queryParams = [];
  const whereConditions = [];

  // 构建搜索条件（与 getAllCheckPrice 保持一致）
  if (searchParams.customer_id) {
    whereConditions.push("cp.customer_id LIKE ?");
    queryParams.push(`%${searchParams.customer_id}%`);
  }
  if (searchParams.asin) {
    whereConditions.push("cp.asin = ?");
    queryParams.push(searchParams.asin);
  }
  if (searchParams.fnsku) {
    whereConditions.push("cp.fnsku = ?");
    queryParams.push(searchParams.fnsku);
  }
  if (searchParams.brand) {
    whereConditions.push("cp.brand LIKE ?");
    queryParams.push(`%${searchParams.brand}%`);
  }
  if (searchParams.win) {
    whereConditions.push("cp.win LIKE ?");
    queryParams.push(`%${searchParams.win}%`);
  }
  if (searchParams.activity_start_date) {
    whereConditions.push("cp.activity_start_date >= ?");
    queryParams.push(searchParams.activity_start_date);
  }
  if (searchParams.activity_end_date) {
    whereConditions.push("cp.activity_end_date <= ?");
    queryParams.push(searchParams.activity_end_date);
  }
  if (searchParams.total_quantity) {
    whereConditions.push("cp.total_quantity >= ?");
    queryParams.push(searchParams.total_quantity);
  }
  if (searchParams.activity_submission_date) {
    whereConditions.push("cp.activity_submission_date >= ?");
    queryParams.push(searchParams.activity_submission_date);
  }
  if (searchParams.requestedQuantity) {
    whereConditions.push("cp.requestedQuantity >= ?");
    queryParams.push(searchParams.requestedQuantity);
  }
  if (searchParams.group_id) {
    whereConditions.push("cp.group_id = ?");
    queryParams.push(searchParams.group_id);
  }
  if (searchParams.activity_type) {
    whereConditions.push("cp.activity_type LIKE ?");
    queryParams.push(`%${searchParams.activity_type}%`);
  }
  if (searchParams.customer_name) {
    whereConditions.push("cp.customer_name LIKE ?");
    queryParams.push(`%${searchParams.customer_name}%`);
  }
  if (searchParams.customer_request) {
    whereConditions.push("cp.customer_request LIKE ?");
    queryParams.push(`%${searchParams.customer_request}%`);
  }
  if (searchParams.adjusted_bd_price) {
    whereConditions.push("cp.adjusted_bd_price >= ?");
    queryParams.push(searchParams.adjusted_bd_price);
  }
  if (searchParams.adjusted_purchase_price) {
    whereConditions.push("cp.adjusted_purchase_price >= ?");
    queryParams.push(searchParams.adjusted_purchase_price);
  }
  if (searchParams.adjustment_time) {
    whereConditions.push("cp.adjustment_time >= ?");
    queryParams.push(searchParams.adjustment_time);
  }

  // 添加WHERE子句
  if (whereConditions.length > 0) {
    query += " WHERE " + whereConditions.join(" AND ");
  }

  // 添加排序（无分页）
  query += " ORDER BY cp.created_at DESC";

  const [rows] = await pool.query(query, queryParams);
  return rows;
};

module.exports = {
  getAllCheckPrice,
  getCheckPriceCount,
  getCheckPriceById,
  createCheckPrice,
  updateCheckPrice,
  deleteCheckPrice,
  getAllCheckPriceForExport,
};
