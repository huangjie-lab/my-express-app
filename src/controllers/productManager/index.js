const productModel = require("../../models/productManager/index.js");
const XLSX = require("xlsx");
const fs = require("fs");

// 查询所有产品
const getAllProduct = async (req, res) => {
  try {
    // 获取分页参数
    const page = parseInt(req.body.page) || 1;
    const pageSize = parseInt(req.body.pageSize) || 10;
    const offset = (page - 1) * pageSize;
    const limit = pageSize;

    // 获取搜索参数
    const searchParams = {
      asin: req.body.asin,
      fnsku: req.body.fnsku,
      title: req.body.title,
      product_name: req.body.product_name,
      brand: req.body.brand,
      store_name: req.body.store_name,
      win_status:
        req.body.win_status !== undefined
          ? parseInt(req.body.win_status)
          : undefined,
      status: req.body.status,
    };

    // 过滤掉undefined的参数
    Object.keys(searchParams).forEach((key) => {
      if (searchParams[key] === undefined) {
        delete searchParams[key];
      }
    });

    const products = await productModel.getAllProductData(
      searchParams,
      limit,
      offset
    );
    res.status(200).json({
      data: products,
      total: products.length,
    });
  } catch (error) {
    res.status(500).json({ message: "获取产品数据失败", error: error.message });
  }
};

// 新增产品 - 添加参数验证
const createProduct = async (req, res) => {
  try {
    // 验证必填字段
    const { asin, brand, title } = req.body;
    if (!asin || !brand || !title) {
      return res
        .status(400)
        .json({ message: "缺少必填字段: asin, brand, title为必填项" });
    }

    // 添加默认值处理
    const productData = {
      transparent_program: req.body.transparent_program || 0,
      inventory_quantity: req.body.inventory_quantity || 0,
      has_battery: req.body.has_battery || 0,
      purchase_quantity: req.body.purchase_quantity || 0,
      invoice_number: req.body.invoice_number || "",
      ...req.body,
    };

    const newProduct = await productModel.createProductData(productData);
    res.status(201).json({
      message: "产品创建成功",
      data: newProduct,
    });
  } catch (error) {
    res.status(500).json({ message: "产品创建失败", error: error.message });
  }
};

// 删除产品
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "缺少产品ID参数" });
    }

    const isDeleted = await productModel.deleteProductData(id);
    if (isDeleted) {
      res.status(200).json({ message: "产品删除成功" });
    } else {
      res.status(404).json({ message: "产品不存在或已被删除" });
    }
  } catch (error) {
    res.status(500).json({ message: "产品删除失败", error: error.message });
  }
};

// 更新产品
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!id || Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "产品ID和更新数据不能为空" });
    }

    const isUpdated = await productModel.updateProductData(id, updateData);
    if (isUpdated) {
      res.status(200).json({ message: "产品更新成功" });
    } else {
      res.status(404).json({ message: "产品不存在或未修改任何数据" });
    }
  } catch (error) {
    res.status(500).json({ message: "产品更新失败", error: error.message });
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

    // 验证表头是否包含必填字段
    const requiredFields = [
      "asin",
      "fnsku",
      "title",
      "brand",
      "win_status",
      "status",
      "product_name",
    ];
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

    // 调用批量插入方法
    const importResult = await productModel.batchInsertProducts(processedData);

    // 清理临时文件
    fs.unlinkSync(filePath);

    res.json({
      success: true,
      message: "Excel文件导入成功",
      data: {
        totalRows: processedData.length,
        successRows: importResult.success,
        failedRows: importResult.failed,
        errors: importResult.errors,
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

module.exports = {
  getAllProduct,
  createProduct,
  deleteProduct,
  updateProduct,
  importProducts,
};
