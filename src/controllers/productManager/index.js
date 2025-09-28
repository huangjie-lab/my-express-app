const productModel = require("../../models/productManager/index.js");
const checkPriceModel = require("../../models/checkPriceModel.js");
const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");

// 查询所有产品 (查询 check_price 表)
const getAllProduct = async (req, res) => {
  try {
    // 获取分页参数
    const page = parseInt(req.body.page) || 1;
    const pageSize = parseInt(req.body.pageSize) || 10;
    const offset = (page - 1) * pageSize;
    const limit = pageSize;

    // 获取搜索参数 (适配 check_price 表)
    const searchParams = {
      asin: req.body.asin,
      fnsku: req.body.fnsku,
      title: req.body.title,
      product_name: req.body.product_name,
      brand: req.body.brand,
      store_name: req.body.store_name,
      win: req.body.win !== undefined ? req.body.win : undefined,
    };

    // 角色权限检查：如果不是管理员，则强制过滤当前用户的数据
    if (req.body.role !== "admin") {
      // 非管理员用户只能查看自己的数据
      searchParams.customer_id = req.body.customer_id;
    }

    // 过滤掉undefined的参数
    Object.keys(searchParams).forEach((key) => {
      if (searchParams[key] === undefined) {
        delete searchParams[key];
      }
    });

    // 同时获取核价数据列表和总数
    const [products, total] = await Promise.all([
      checkPriceModel.getAllCheckPrice(searchParams, limit, offset),
      checkPriceModel.getCheckPriceCount(searchParams),
    ]);

    res.status(200).json({
      data: products,
      total: total,
    });
  } catch (error) {
    res.status(500).json({ message: "获取数据失败", error: error.message });
  }
};

// 新增产品 - 添加参数验证 (插入到 check_price 表)
const createProduct = async (req, res) => {
  try {
    // 验证必填字段
    const { asin, fnsku, brand, product_name, customer_id } = req.body;
    if (!asin || !fnsku || !brand || !product_name || !customer_id) {
      return res.status(400).json({
        message:
          "缺少必填字段: asin, fnsku, brand, product_name, customer_id为必填项",
      });
    }

    // 准备核价数据，设置默认值
    const checkPriceData = {
      // customer_id: req.body.customer_id || null,
      // asin: req.body.asin,
      // win: req.body.win || null,
      // fnsku: req.body.fnsku,
      // brand: req.body.brand,
      // product_name: req.body.product_name,
      // title: req.body.title || "",
      // shipping_method: req.body.shipping_method || null,
      // promotion_method: req.body.promotion_method || null,
      // hold_price: req.body.hold_price || 0,
      // bd_price: req.body.bd_price || 0,
      // initial_review_price: req.body.initial_review_price || 0,
      // final_review_price: req.body.final_review_price || 0,
      // purchase_price: req.body.purchase_price || 0,
      // pricing_benchmark: req.body.pricing_benchmark || null,
      // woot_notes: req.body.woot_notes || null,
      // msrp_price: req.body.msrp_price || 0,
      // inventory_quantity: req.body.inventory_quantity || 0,
      // actual_quantity: req.body.actual_quantity || 0,
      // invoice_number: req.body.invoice_number || null,
      // transparent_program: req.body.transparent_program || "N",
      // amz_commission: req.body.amz_commission || 0,
      // fba_shipping_fee: req.body.fba_shipping_fee || 0,
      // weight: req.body.weight || 0,
      // length: req.body.length || 0,
      // width: req.body.width || 0,
      // height: req.body.height || 0,
      // store_id: req.body.store_id || null,
      // store_name: req.body.store_name || null,
      // store_email: req.body.store_email || null,
      // submission_time: req.body.submission_time || null,
      // has_battery: req.body.has_battery || "N",
      // battery_type: req.body.battery_type || null,
      // battery_capacity: req.body.battery_capacity || 0,
      // status: req.body.status || null,
      // initial_purchase_price: req.body.initial_purchase_price || 0,
      // final_purchase_price: req.body.final_purchase_price || 0,
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
      adjusted_bd_price: req.body.adjusted_bd_price || 0,
      adjusted_purchase_price: req.body.adjusted_purchase_price || 0,
      customer_name: req.body.customer_name || "",
      customer_request: req.body.customer_request || "",
      return_to_woot: req.body.return_to_woot || "",
      registration_date: req.body.registration_date || null,
      allowed_return_quantity: req.body.allowed_return_quantity || 0,
      retained_quantity: req.body.retained_quantity || 0,
      ...req.body,
    };

    const newCheckPrice = await checkPriceModel.createCheckPrice(
      checkPriceData
    );
    res.status(201).json({
      message: "创建成功",
      data: newCheckPrice,
    });
  } catch (error) {
    console.error("Error creating check price data:", error);
    res.status(500).json({
      message: "创建失败",
      error: error.message,
    });
  }
};

// 删除产品 (删除 check_price 表数据)
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "缺少产品ID参数" });
    }

    const isDeleted = await checkPriceModel.deleteCheckPrice(id);
    if (isDeleted) {
      res.status(200).json({ message: "删除成功" });
    } else {
      res.status(404).json({ message: "数据不存在或已被删除" });
    }
  } catch (error) {
    res.status(500).json({ message: "删除失败", error: error.message });
  }
};

// 更新产品 (更新 check_price 表数据)
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!id || Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "产品ID和更新数据不能为空" });
    }

    const isUpdated = await checkPriceModel.updateCheckPrice(id, updateData);
    if (isUpdated) {
      res.status(200).json({ message: "更新成功" });
    } else {
      res.status(404).json({ message: "数据不存在或未修改任何数据" });
    }
  } catch (error) {
    res.status(500).json({ message: "更新失败", error: error.message });
  }
};

// 导入Excel产品数据
const importProducts = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "请上传Excel文件",
      });
    }

    const filePath = req.file.path;
    const workbook = XLSX.readFile(filePath);

    // 获取第一个工作表
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // 将工作表转换为JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet, {
      header: 1,
      defval: "",
      raw: false,
    });

    // 处理数据：第一行作为表头
    const headers = jsonData[0] || [];
    const rows = jsonData.slice(1);

    // 验证表头是否包含必填字段 (check_price表)
    const requiredFields = ["asin", "fnsku", "brand", "product_name"];
    const missingFields = requiredFields.filter(
      (field) => !headers.includes(field)
    );

    if (missingFields.length > 0) {
      // 清理临时文件
      fs.unlinkSync(filePath);
      return res.status(400).json({
        success: false,
        message: `Excel文件缺少必填字段: ${missingFields.join(", ")}`,
      });
    }

    // 处理数据行
    const processedData = rows.map((row, index) => {
      const rowData = {};
      headers.forEach((header, colIndex) => {
        if (header) {
          rowData[header] = row[colIndex] || "";
        }
      });
      return rowData;
    });

    // 逐条插入数据到 check_price 表
    let successCount = 0;
    let failedCount = 0;
    const errors = [];

    for (let i = 0; i < processedData.length; i++) {
      const product = processedData[i];
      try {
        // 验证必填字段
        if (
          !product.asin ||
          !product.fnsku ||
          !product.brand ||
          !product.product_name
        ) {
          errors.push({
            row: i + 2, // Excel行号（从2开始，因为第1行是表头）
            error: "缺少必填字段: asin, fnsku, brand, product_name为必填项",
          });
          failedCount++;
          continue;
        }

        // 准备核价数据
        const checkPriceData = {
          customer_id: product.customer_id || null,
          asin: product.asin,
          win: product.win || null,
          fnsku: product.fnsku,
          brand: product.brand,
          product_name: product.product_name,
          title: product.title || "",
          shipping_method: product.shipping_method || null,
          promotion_method: product.promotion_method || null,
          hold_price: product.hold_price || 0,
          bd_price: product.bd_price || 0,
          initial_review_price: product.initial_review_price || 0,
          final_review_price: product.final_review_price || 0,
          purchase_price: product.purchase_price || 0,
          pricing_benchmark: product.pricing_benchmark || null,
          woot_notes: product.woot_notes || null,
          msrp_price: product.msrp_price || 0,
          inventory_quantity: product.inventory_quantity || 0,
          actual_quantity: product.actual_quantity || 0,
          invoice_number: product.invoice_number || null,
          transparent_program: product.transparent_program || "N",
          amz_commission: product.amz_commission || 0,
          fba_shipping_fee: product.fba_shipping_fee || 0,
          weight: product.weight || 0,
          length: product.length || 0,
          width: product.width || 0,
          height: product.height || 0,
          store_id: product.store_id || null,
          store_name: product.store_name || null,
          store_email: product.store_email || null,
          submission_time: product.submission_time || null,
          has_battery: product.has_battery || "N",
          battery_type: product.battery_type || null,
          battery_capacity: product.battery_capacity || 0,
          status: product.status || null,
          initial_purchase_price: product.initial_purchase_price || 0,
          final_purchase_price: product.final_purchase_price || 0,
        };

        await checkPriceModel.createCheckPrice(checkPriceData);
        successCount++;
      } catch (error) {
        errors.push({
          row: i + 2,
          error: error.message,
        });
        failedCount++;
      }
    }

    // 清理临时文件
    fs.unlinkSync(filePath);

    res.json({
      success: true,
      message: "Excel文件导入完成",
      data: {
        totalRows: processedData.length,
        successRows: successCount,
        failedRows: failedCount,
        errors: errors,
      },
    });
  } catch (error) {
    console.error("Excel导入错误:", error);

    // 清理临时文件（如果存在）
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      success: false,
      message: "Excel文件导入失败",
      error: error.message,
    });
  }
};

// 导出产品数据为Excel
const exportProducts = async (req, res) => {
  req.body = req.body || {};

  try {
    // 获取查询参数 (适配 check_price 表)
    const searchParams = {
      asin: req.body.asin,
      fnsku: req.body.fnsku,
      title: req.body.title,
      product_name: req.body.product_name,
      brand: req.body.brand,
      store_name: req.body.store_name,
      win: req.body.win !== undefined ? req.body.win : undefined,
    };

    // 角色权限检查：如果不是管理员，则强制过滤当前用户的数据
    if (req.body.role !== "admin") {
      // 非管理员用户只能导出自己的数据
      searchParams.customer_id = req.body.customer_id || req.user.id;
    }

    // 过滤掉undefined的参数
    Object.keys(searchParams).forEach((key) => {
      if (searchParams[key] === undefined) {
        delete searchParams[key];
      }
    });

    // 获取所有数据（不分页）- 从 check_price 表
    const products = await checkPriceModel.getAllCheckPrice(
      searchParams,
      10000,
      0
    );

    if (!products || products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "没有找到要导出的数据",
      });
    }

    // 创建工作簿
    const workbook = XLSX.utils.book_new();

    // 创建工作表
    const worksheet = XLSX.utils.json_to_sheet(products);

    // 添加工作表到工作簿
    XLSX.utils.book_append_sheet(workbook, worksheet, "产品数据");

    // 生成临时文件路径
    const tempDir = path.join(__dirname, "../../../uploads/excel");
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const tempFileName = `products_export_${Date.now()}.xlsx`;
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
      `attachment; filename="products_export.xlsx"`
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
    console.error("产品导出错误:", error);
    res.status(500).json({
      success: false,
      message: "产品导出失败",
      error: error.message,
    });
  }
};

module.exports = {
  getAllProduct,
  createProduct,
  deleteProduct,
  updateProduct,
  importProducts,
  exportProducts,
};
