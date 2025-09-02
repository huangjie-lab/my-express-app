const goodsModel = require("../models/goodsModel");

// 获取商品列表
const getGoods = async (req, res) => {
  try {
    const [goods, total] = await Promise.all([
      goodsModel.getGoods(req.body),
      goodsModel.getGoodsTotal(req.body),
    ]);
    res.status(200).send({
      message: "商品列表获取成功",
      data: {
        list: goods,
        total: total,
        page: parseInt(req.body.page) || 1,
        limit: parseInt(req.body.limit) || 10,
        pages: Math.ceil(total / (parseInt(req.body.limit) || 10)),
      },
    });
  } catch (error) {
    res.status(500).send({
      error: "服务器错误",
      message: error.message,
    });
  }
};

// 添加商品
const addGood = async (req, res) => {
  try {
    const {
      asin,
      fnsku,
      win,
      brand,
      title,
      bd_price,
      purchase_price,
      quantity,
    } = req.body;

    // 验证必填字段
    if (!asin || !title || !purchase_price) {
      return res.status(400).send({
        error: "参数错误",
        message: "asin、title和purchase_price为必填字段",
      });
    }

    const goodId = await goodsModel.addGood(req.body);
    res.status(201).send({
      message: "商品添加成功",
      data: { id: goodId },
    });
  } catch (error) {
    res.status(500).send({
      error: "服务器错误",
      message: error.message,
    });
  }
};

// 更新商品
const updateGood = async (req, res) => {
  try {
    const { id } = req.params;
    const goodData = req.body;

    // 检查商品是否存在
    const existingGood = await goodsModel.getGoodById(id);
    if (!existingGood) {
      return res.status(404).send({
        error: "商品不存在",
        message: `未找到id为${id}的商品`,
      });
    }

    const isUpdated = await goodsModel.updateGood(id, goodData);
    if (isUpdated) {
      res.status(200).send({
        message: "商品更新成功",
      });
    } else {
      res.status(400).send({
        error: "更新失败",
        message: "未修改任何商品信息",
      });
    }
  } catch (error) {
    res.status(500).send({
      error: "服务器错误",
      message: error.message,
    });
  }
};

// 删除商品
const delGood = async (req, res) => {
  try {
    const { id } = req.params;
    const isDeleted = await goodsModel.delGood(id);

    if (isDeleted) {
      res.status(200).send({
        message: "商品删除成功",
      });
    } else {
      res.status(404).send({
        error: "商品不存在",
        message: `未找到id为${id}的商品`,
      });
    }
  } catch (error) {
    res.status(500).send({
      error: "服务器错误",
      message: error.message,
    });
  }
};

module.exports = {
  getGoods,
  addGood,
  updateGood,
  delGood,
};
