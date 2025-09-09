const pool = require("../../config/db.js");

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
    initial_review_price,
    final_review_price,
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
    hold_price, bd_price, msrp_price, fba_fee, amz_commission, initial_review_price, final_review_price,
    inventory_quantity, weight, length, width, height,
    has_battery, battery_type, battery_capacity, 
    store_id, store_name, store_email, 
    win_status, status, submit_time, invoice_number, purchase_quantity
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

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
    initial_review_price,
    final_review_price,
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

// 批量插入产品数据
const batchInsertProducts = async (productsData) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const results = [];
    const errors = [];

    for (let i = 0; i < productsData.length; i++) {
      const product = productsData[i];
      try {
        // 验证必填字段
        if (
          !product.asin ||
          !product.fnsku ||
          !product.title ||
          !product.brand ||
          product.win_status === undefined ||
          product.win_status === null ||
          !product.status ||
          !product.product_name
        ) {
          errors.push({
            row: i + 2, // Excel行号（从2开始，因为第1行是表头）
            error:
              "缺少必填字段: asin, fnsku, title, brand, win_status, status, product_name为必填项",
          });
          continue;
        }

        // 检查ASIN是否已存在
        const [existingProducts] = await connection.execute(
          "SELECT id FROM product_management WHERE asin = ?",
          [product.asin]
        );

        if (existingProducts.length > 0) {
          errors.push({
            row: i + 2,
            error: "ASIN已存在",
          });
          continue;
        }

        // 准备插入数据，设置默认值
        const insertData = {
          asin: product.asin,
          fnsku: product.fnsku,
          brand: product.brand,
          title: product.title,
          product_name: product.product_name,
          remark: product.remark || "",
          shipping_method: product.shipping_method || "",
          campaign_method: product.campaign_method || "",
          transparent_program: product.transparent_program || 0,
          hold_price: product.hold_price || 0,
          bd_price: product.bd_price || 0,
          msrp_price: product.msrp_price || 0,
          fba_fee: product.fba_fee || 0,
          amz_commission: product.amz_commission || 0,
          initial_review_price: product.initial_review_price || 0,
          final_review_price: product.final_review_price || 0,
          inventory_quantity: product.inventory_quantity || 0,
          weight: product.weight || 0,
          length: product.length || 0,
          width: product.width || 0,
          height: product.height || 0,
          has_battery: product.has_battery || 0,
          battery_type: product.battery_type || "",
          battery_capacity: product.battery_capacity || "",
          store_id: product.store_id || "",
          store_name: product.store_name || "",
          store_email: product.store_email || "",
          win_status: product.win_status,
          status: product.status,
          submit_time: product.submit_time || formatDateTime(new Date()),
          invoice_number: product.invoice_number || "",
          purchase_quantity: product.purchase_quantity || 0,
        };

        // 插入产品数据
        const [result] = await connection.execute(
          `INSERT INTO product_management (
            asin, fnsku, brand, title, product_name, remark, 
            shipping_method, campaign_method, transparent_program, 
            hold_price, bd_price, msrp_price, fba_fee, amz_commission, initial_review_price, final_review_price, 
            inventory_quantity, weight, length, width, height, 
            has_battery, battery_type, battery_capacity, 
            store_id, store_name, store_email, 
            win_status, status, submit_time, invoice_number, purchase_quantity
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            insertData.asin,
            insertData.fnsku,
            insertData.brand,
            insertData.title,
            insertData.product_name,
            insertData.remark,
            insertData.shipping_method,
            insertData.campaign_method,
            insertData.transparent_program,
            insertData.hold_price,
            insertData.bd_price,
            insertData.msrp_price,
            insertData.fba_fee,
            insertData.amz_commission,
            insertData.initial_review_price,
            insertData.final_review_price,
            insertData.inventory_quantity,
            insertData.weight,
            insertData.length,
            insertData.width,
            insertData.height,
            insertData.has_battery,
            insertData.battery_type,
            insertData.battery_capacity,
            insertData.store_id,
            insertData.store_name,
            insertData.store_email,
            insertData.win_status,
            insertData.status,
            insertData.submit_time,
            insertData.invoice_number,
            insertData.purchase_quantity,
          ]
        );

        results.push({
          row: i + 2,
          id: result.insertId,
          success: true,
        });
      } catch (error) {
        errors.push({
          row: i + 2,
          error: error.message,
        });
      }
    }

    await connection.commit();

    return {
      success: results.length,
      failed: errors.length,
      results,
      errors,
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

// 获取产品总数（支持搜索条件）
const getProductCount = async (searchParams) => {
  let query = "SELECT COUNT(*) as total FROM product_management";
  const queryParams = [];
  const whereConditions = [];

  // 构建搜索条件（与 getAllProductData 保持一致）
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

  const [rows] = await pool.query(query, queryParams);
  return rows[0]?.total || 0;
};

module.exports = {
  getAllProductData,
  createProductData,
  deleteProductData,
  updateProductData,
  batchInsertProducts,
  getProductCount,
};
