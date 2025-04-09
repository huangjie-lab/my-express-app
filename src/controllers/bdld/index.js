const bdldModel = require("../../models/bdld/index");

// 获取BDLD活动报名表单
const getBdld = async (req, res) => {
  try {
    const users = await bdldModel.getBdldData();
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Database query failed" });
  }
};
// 新增BDLD活动报名表单
const addBdld = async (req, res) => {
  // try {
  //   const users = await bdldModel.getBdldData();
  //   res.json(users);
  // } catch (err) {
  //   console.error("Error fetching users:", err);
  //   res.status(500).json({ error: "Database query failed" });
  // }
};

module.exports = {
  getBdld,
  addBdld,
};
