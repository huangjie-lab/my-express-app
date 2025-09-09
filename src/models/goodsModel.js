const pool = require("../config/db.js");

// 获取商品列表（支持分页和条件查询）
const getGoods = async (params) => {
  const { asin, brand, title, page = 1, limit = 10 } = params;
  const offset = (page - 1) * limit;
  let query = "SELECT * FROM take_goods WHERE 1=1";
  const queryParams = [];

  if (asin) {
    query += " AND asin = ?";
    queryParams.push(asin);
  }
  if (brand) {
    query += " AND brand = ?";
    queryParams.push(brand);
  }
  if (title) {
    query += " AND title LIKE ?";
    queryParams.push(`%${title}%`);
  }

  // 添加分页
  query += " LIMIT ? OFFSET ?";
  queryParams.push(limit, offset);

  const [rows] = await pool.query(query, queryParams);
  return rows;
};

// 获取商品总数
const getGoodsTotal = async (params) => {
  const { asin, brand, title } = params;
  let query = "SELECT COUNT(*) as total FROM take_goods WHERE 1=1";
  const queryParams = [];

  if (asin) {
    query += " AND asin = ?";
    queryParams.push(asin);
  }
  if (brand) {
    query += " AND brand = ?";
    queryParams.push(brand);
  }
  if (title) {
    query += " AND title LIKE ?";
    queryParams.push(`%${title}%`);
  }

  const [rows] = await pool.query(query, queryParams);
  return rows[0]?.total || 0;
};
// 获取单个商品
const getGoodById = async (id) => {
  const [rows] = await pool.query("SELECT * FROM take_goods WHERE id = ?", [
    id,
  ]);
  return rows[0];
};

// 添加商品
const addGood = async (goodData) => {
  const { asin, fnsku, win, brand, title, bd_price, purchase_price, quantity } =
    goodData;
  const [result] = await pool.query(
    "INSERT INTO take_goods (asin, fnsku, win, brand, title, bd_price, purchase_price, quantity) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [asin, fnsku, win, brand, title, bd_price, purchase_price, quantity]
  );
  return result.insertId;
};

// 更新商品
const updateGood = async (id, goodData) => {
  const { asin, fnsku, win, brand, title, bd_price, purchase_price, quantity } =
    goodData;
  const [result] = await pool.query(
    "UPDATE take_goods SET asin = ?, fnsku = ?, win = ?, brand = ?, title = ?, bd_price = ?, purchase_price = ?, quantity = ? WHERE id = ?",
    [asin, fnsku, win, brand, title, bd_price, purchase_price, quantity, id]
  );
  return result.affectedRows > 0;
};

// 删除商品
const delGood = async (id) => {
  const [result] = await pool.query("DELETE FROM take_goods WHERE id = ?", [
    id,
  ]);
  return result.affectedRows > 0;
};

module.exports = {
  getGoods,
  getGoodsTotal,
  getGoodById,
  addGood,
  updateGood,
  delGood,
};
