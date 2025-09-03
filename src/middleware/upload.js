const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

// 确保上传目录存在
const uploadDir = path.join(__dirname, "../../uploads");
const fs = require("fs");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 配置存储
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // 生成唯一文件名
    const uniqueFilename = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueFilename);
  },
});

// 文件过滤（仅允许图片）
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("仅允许上传JPG、PNG和GIF格式的图片"), false);
  }
};

// 配置multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 限制5MB
  },
  fileFilter: fileFilter,
});

module.exports = upload;
