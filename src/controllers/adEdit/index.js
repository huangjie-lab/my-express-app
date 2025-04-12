const adEditModel = require("../../models/adEdit/index");

// 获取BDLD活动报名表单
const getAdEdit = async (req, res) => {
  try {
    const user = await adEditModel.getAdEditData();
    res.json(user);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Error" });
  }
};
// 新增BDLD活动报名表单
const addAdEdit = async (req, res) => {
  // 此处校验req.body非空
  try {
    const id = await adEditModel.addAdEditData(req.body);
    res.json({ success: true, id });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Error" });
  }
};

module.exports = {
  getAdEdit,
  addAdEdit,
};
