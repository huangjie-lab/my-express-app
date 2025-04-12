const adSetModel = require("../../models/adSet/index");

// 获取BDLD活动报名表单
const getAdSet = async (req, res) => {
  try {
    const user = await adSetModel.getAdSetData();
    res.json(user);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Error" });
  }
};
// 新增BDLD活动报名表单
const addAdSet = async (req, res) => {
  // 此处校验req.body非空
  try {
    const id = await adSetModel.addAdSetData(req.body);
    res.json({ success: true, id });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Error" });
  }
};

module.exports = {
  getAdSet,
  addAdSet,
};
