const checkPriceModel = require("../models/checkPriceModel.js");
const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");

// 获取所有核价数据（支持分页和搜索）
const getAllCheckPrice = async (req, res) => {
  try {
    // 获取分页参数
    const page = parseInt(req.body.page) || 1;
    const pageSize = parseInt(req.body.pageSize) || 10;
    const offset = (page - 1) * pageSize;
    const limit = pageSize;

    // 获取搜索参数
    const searchParams = {
      customer_id: req.body.customer_id,
      asin: req.body.asin,
      fnsku: req.body.fnsku,
      brand: req.body.brand,
      product_name: req.body.product_name,
      store_name: req.body.store_name,
      transparent_program: req.body.transparent_program,
      has_battery: req.body.has_battery,
      win: req.body.win,
      shipping_method: req.body.shipping_method,
      activity_start_date: req.body.activity_start_date,
      activity_end_date: req.body.activity_end_date,
      total_quantity: req.body.total_quantity,
      activity_submission_date: req.body.activity_submission_date,
      requestedQuantity: req.body.requestedQuantity,
      group_id: req.body.group_id,
      activity_type: req.body.activity_type,
    };

    // 过滤掉undefined的搜索参数
    Object.keys(searchParams).forEach((key) => {
      if (
        searchParams[key] === undefined ||
        searchParams[key] === null ||
        searchParams[key] === ""
      ) {
        delete searchParams[key];
      }
    });

    // 获取核价数据列表和总数
    const [checkPriceData, total] = await Promise.all([
      checkPriceModel.getAllCheckPrice(searchParams, limit, offset),
      checkPriceModel.getCheckPriceCount(searchParams),
    ]);

    res.status(200).json({
      success: true,
      data: checkPriceData,
      total,
    });
  } catch (error) {
    console.error("Error getting all check price data:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get check price data",
      message: error.message,
    });
  }
};

// 根据ID获取核价数据
const getCheckPriceById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "缺少核价数据ID参数",
      });
    }

    const checkPriceData = await checkPriceModel.getCheckPriceById(id);

    if (!checkPriceData) {
      return res.status(404).json({
        success: false,
        message: "核价数据不存在",
      });
    }

    res.status(200).json({
      success: true,
      data: checkPriceData,
    });
  } catch (error) {
    console.error("Error getting check price data by ID:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get check price data",
      message: error.message,
    });
  }
};

// 创建核价数据
const createCheckPrice = async (req, res) => {
  try {
    // 验证必填字段
    const { asin, fnsku, brand, product_name } = req.body;

    if (!asin || !fnsku || !brand || !product_name) {
      return res.status(400).json({
        success: false,
        message: "缺少必填字段: asin, fnsku, brand, product_name为必填项",
      });
    }

    // 添加默认值处理
    const checkPriceData = {
      hold_price: req.body.hold_price || 0,
      bd_price: req.body.bd_price || 0,
      initial_review_price: req.body.initial_review_price || 0,
      final_review_price: req.body.final_review_price || 0,
      purchase_price: req.body.purchase_price || 0,
      msrp_price: req.body.msrp_price || 0,
      inventory_quantity: req.body.inventory_quantity || 0,
      actual_quantity: req.body.actual_quantity || 0,
      amz_commission: req.body.amz_commission || 0,
      fba_shipping_fee: req.body.fba_shipping_fee || 0,
      weight: req.body.weight || 0,
      length: req.body.length || 0,
      width: req.body.width || 0,
      height: req.body.height || 0,
      battery_capacity: req.body.battery_capacity || 0,
      transparent_program: req.body.transparent_program || "N",
      has_battery: req.body.has_battery || "N",
      customer_id: req.body.customer_id || 0,
      total_quantity: req.body.total_quantity || 0,
      requestedQuantity: req.body.requestedQuantity || 0,
      group_id: req.body.group_id || 0,
      ...req.body,
    };

    const newCheckPrice = await checkPriceModel.createCheckPrice(
      checkPriceData
    );

    res.status(201).json({
      success: true,
      message: "核价数据创建成功",
      data: newCheckPrice,
    });
  } catch (error) {
    console.error("Error creating check price data:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create check price data",
      message: error.message,
    });
  }
};

// 更新核价数据
const updateCheckPrice = async (req, res) => {
  try {
    const { id } = req.params;

    const updateData = req.body;

    if (!id || Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "核价数据ID和更新数据不能为空",
      });
    }

    // 处理 user_id 字段映射到 customer_id
    if (updateData.user_id) {
      updateData.customer_id = updateData.user_id;
      delete updateData.user_id; // 删除 user_id 避免传递不存在的字段
    }

    const isUpdated = await checkPriceModel.updateCheckPrice(id, updateData);

    if (isUpdated) {
      res.status(200).json({
        success: true,
        message: "核价数据更新成功",
      });
    } else {
      res.status(404).json({
        success: false,
        message: "核价数据不存在或未修改任何数据",
      });
    }
  } catch (error) {
    console.error("Error updating check price data:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update check price data",
      message: error.message,
    });
  }
};

// 删除核价数据
const deleteCheckPrice = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "缺少核价数据ID参数",
      });
    }

    const isDeleted = await checkPriceModel.deleteCheckPrice(id);

    if (isDeleted) {
      res.status(200).json({
        success: true,
        message: "核价数据删除成功",
      });
    } else {
      res.status(404).json({
        success: false,
        message: "核价数据不存在或已被删除",
      });
    }
  } catch (error) {
    console.error("Error deleting check price data:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete check price data",
      message: error.message,
    });
  }
};

// 导出核价数据为Excel
const exportCheckPrice = async (req, res) => {
  req.body = req.body || {};

  try {
    // 获取搜索参数（与getAllCheckPrice保持一致）
    const searchParams = {
      customer_id: req.body.customer_id,
      asin: req.body.asin,
      fnsku: req.body.fnsku,
      brand: req.body.brand,
      win: req.body.win,
      activity_start_date: req.body.activity_start_date,
      activity_end_date: req.body.activity_end_date,
      total_quantity: req.body.total_quantity,
      activity_submission_date: req.body.activity_submission_date,
      requestedQuantity: req.body.requestedQuantity,
      group_id: req.body.group_id,
      activity_type: req.body.activity_type,
    };

    // 过滤掉undefined的搜索参数
    Object.keys(searchParams).forEach((key) => {
      if (
        searchParams[key] === undefined ||
        searchParams[key] === null ||
        searchParams[key] === ""
      ) {
        delete searchParams[key];
      }
    });

    // 获取所有数据（不分页）
    const checkPriceData = await checkPriceModel.getAllCheckPriceForExport(
      searchParams
    );

    if (!checkPriceData || checkPriceData.length === 0) {
      return res.status(404).json({
        success: false,
        message: "没有找到要导出的核价数据",
      });
    }

    // 创建工作簿
    const workbook = XLSX.utils.book_new();

    // 创建工作表
    const worksheet = XLSX.utils.json_to_sheet(checkPriceData);

    // 添加工作表到工作簿
    XLSX.utils.book_append_sheet(workbook, worksheet, "核价数据");

    // 生成临时文件路径
    const tempDir = path.join(__dirname, "../../uploads/excel");
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const tempFileName = `check_price_export_${Date.now()}.xlsx`;
    const tempFilePath = path.join(tempDir, tempFileName);

    // 写入文件
    XLSX.writeFile(workbook, tempFilePath);

    // 设置响应头
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="check_price_export.xlsx"`
    );

    // 发送文件
    res.sendFile(tempFilePath, (err) => {
      if (err) {
        console.error("文件发送错误:", err);
      }
      // 清理临时文件
      if (fs.existsSync(tempFilePath)) {
        fs.unlinkSync(tempFilePath);
      }
    });
  } catch (error) {
    console.error("核价数据导出错误:", error);
    res.status(500).json({
      success: false,
      message: "核价数据导出失败",
      error: error.message,
    });
  }
};

module.exports = {
  getAllCheckPrice,
  getCheckPriceById,
  createCheckPrice,
  updateCheckPrice,
  deleteCheckPrice,
  exportCheckPrice,
};
