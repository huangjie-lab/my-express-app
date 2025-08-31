const pool = require("../../config/db.js");
// 获取 ASIN 数据（支持多字段查询和分页）
const getAsinData = async ({ asin, brand, title, page = 1, pageSize = 10 }) => {
  const conditions = [];
  const params = [];

  // 构建查询条件
  if (asin) {
    conditions.push("asin = ?");
    params.push(asin);
  }
  if (brand) {
    conditions.push("brand = ?");
    params.push(brand);
  }
  if (title) {
    conditions.push("title LIKE ?");
    params.push(`%${title}%`); // 支持模糊查询
  }

  const whereClause = conditions.length
    ? `WHERE ${conditions.join(" AND ")}`
    : "";
  const offset = (page - 1) * pageSize;

  // 查询数据
  const [data] = await pool.query(
    `SELECT * FROM exit_asin_table ${whereClause} LIMIT ? OFFSET ?`,
    [...params, pageSize, offset]
  );

  // 查询总数
  const [countResult] = await pool.query(
    `SELECT COUNT(*) as total FROM exit_asin_table ${whereClause}`,
    params
  );

  return { data, total: countResult[0].total };
};

const addAsinData = async (body) => {
  const { asin, brand, title } = body;

  const [result] = await pool.query(
    "INSERT INTO exit_asin_table (asin, brand, title) VALUES (?,?,?)",
    [asin, brand, title]
  );
  return result.insertId;
};

const updateAsinData = async (body) => {
  const { id, asin, brand, title } = body;
  const [result] = await pool.query(
    "UPDATE exit_asin_table SET asin = ?, brand = ?, title = ? WHERE id = ?",
    [asin, brand, title, id]
  );
  return result;
};

const deleteAsinById = async ({ id }) => {
  const [result] = await pool.query(
    "DELETE FROM exit_asin_table WHERE id = ?",
    [id]
  );
  return result;
};

module.exports = {
  getAsinData,
  addAsinData,
  updateAsinData,
  deleteAsinById,
};
