const pool = require("../config/db.js");

// 获取活动列表，支持条件查询和分页
const getActivities = async (params) => {
  const { group_id, activity_type, asin, page = 1, limit = 10 } = params;
  const offset = (page - 1) * limit;
  let query = "SELECT * FROM campaign_activities WHERE 1=1";
  const queryParams = [];

  if (group_id) {
    query += " AND group_id = ?";
    queryParams.push(group_id);
  }
  if (activity_type) {
    query += " AND activity_type = ?";
    queryParams.push(activity_type);
  }
  if (asin) {
    query += " AND asin = ?";
    queryParams.push(asin);
  }

  // 添加分页
  query += " LIMIT ? OFFSET ?";
  queryParams.push(limit, offset);

  const [rows] = await pool.query(query, queryParams);
  return rows;
};

// 添加活动
const addActivities = async (activityData) => {
  const {
    group_id,
    activity_type,
    start_date,
    end_date,
    title,
    asin,
    win,
    bd_price,
  } = activityData;
  const [result] = await pool.query(
    "INSERT INTO campaign_activities (group_id, activity_type, start_date, end_date, title, asin, win, bd_price) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [group_id, activity_type, start_date, end_date, title, asin, win, bd_price]
  );
  return result.insertId;
};

// 更新活动
const updateActivities = async (id, activityData) => {
  const {
    group_id,
    activity_type,
    start_date,
    end_date,
    title,
    asin,
    win,
    bd_price,
  } = activityData;
  const [result] = await pool.query(
    "UPDATE campaign_activities SET group_id = ?, activity_type = ?, start_date = ?, end_date = ?, title = ?, asin = ?, win = ?, bd_price = ? WHERE id = ?",
    [
      group_id,
      activity_type,
      start_date,
      end_date,
      title,
      asin,
      win,
      bd_price,
      id,
    ]
  );
  return result.affectedRows > 0;
};

// 删除活动
const delActivities = async (id) => {
  const [result] = await pool.query(
    "DELETE FROM campaign_activities WHERE id = ?",
    [id]
  );
  return result.affectedRows > 0;
};

module.exports = {
  getActivities,
  addActivities,
  updateActivities,
  delActivities,
};
