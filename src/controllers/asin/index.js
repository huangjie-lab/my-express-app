const asinModel = require("../../models/asin/index.js");

// 添加 Asin
const addAsin = async (req, res) => {
  const { asin, brand, title } = req.body || {};

  if (!asin || !brand || !title) {
    return res.status(400).send({
      error: "缺少必要参数: asin, brand, title",
    });
  }

  try {
    const insertId = await asinModel.addAsinData({
      asin,
      brand,
      title,
    });
    return res.status(201).send({
      message: "添加成功",
      id: insertId,
      success: true,
    });
  } catch (error) {
    return res.status(500).send({ error: "Server error" });
  }
};

// 编辑 Asin
const editAsin = async (req, res) => {
  const { id } = req.params || {};
  const { asin, brand, title } = req.body || {};
  if (!id || !asin || !brand || !title) {
    return res.status(400).send({
      error: "缺少必要参数: id, asin, brand, title",
    });
  }
  try {
    const rows = await asinModel.updateAsinData({ id, asin, brand, title });
    return res.status(200).send({
      message: "编辑成功",
      data: rows,
      success: true,
    });
  } catch (error) {
    return res.status(500).send({ error: "Server error" });
  }
};

// 删除 Asin
const deleteAsin = async (req, res) => {
  const { id } = req.params || {};
  if (!id) {
    return res.status(400).send({ error: "缺少必要参数: id" });
  }
  try {
    const rows = await asinModel.deleteAsinById({ id });
    return res.status(200).send({
      message: "删除成功",
      data: rows,
      success: true,
    });
  } catch (error) {
    return res.status(500).send({ error: "Server error" });
  }
};

// 查询 Asins 列表（支持多字段查询和分页）
const getAsins = async (req, res) => {
  try {
    // 从查询参数获取过滤条件和分页信息
    const { asin, brand, title, page = 1, pageSize = 10 } = req.body;
    const pageNum = parseInt(page, 10) || 1;
    const size = parseInt(pageSize, 10) || 10;

    // 调用模型层获取数据
    const result = await asinModel.getAsinData({
      asin,
      brand,
      title,
      page: pageNum,
      pageSize: size,
    });

    return res.status(200).send({
      data: result.data,
      success: true,
      total: result.total,
    });
  } catch (error) {
    return res.status(500).send({ error: "Server error" });
  }
};

module.exports = {
  addAsin,
  editAsin,
  deleteAsin,
  getAsins,
};
