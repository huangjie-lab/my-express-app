const pool = require("../../config/db.js");
// 获取 ASIN 数据
const getAsinData = async () => {
  const [rows] = await pool.query(`SELECT * FROM exit_asin_table`);
  return rows;
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
