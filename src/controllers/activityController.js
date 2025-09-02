const activityModel = require("../models/activityModel");

// 获取活动列表
const getActivities = async (req, res) => {
  try {
    const [activities, total] = await Promise.all([
      activityModel.getActivities(req.body),
      activityModel.getActivitiesTotal(req.body),
    ]);
    res.status(200).send({
      message: "活动列表获取成功",
      data: {
        list: activities,
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

// 添加活动
const addActivities = async (req, res) => {
  try {
    const {
      group_id,
      activity_type,
      start_date,
      end_date,
      title,
      asin,
      win,
      bd_price,
    } = req.body;

    // 验证必填字段
    if (!group_id || !activity_type || !start_date || !end_date || !title) {
      return res.status(400).send({
        error: "参数错误",
        message:
          "group_id, activity_type, start_date, end_date, title为必填字段",
      });
    }

    const activityId = await activityModel.addActivities(req.body);
    res.status(201).send({
      message: "活动添加成功",
      data: { id: activityId },
    });
  } catch (error) {
    res.status(500).send({
      error: "服务器错误",
      message: error.message,
    });
  }
};

// 更新活动
const updateActivities = async (req, res) => {
  try {
    const { id } = req.params;
    const activityData = req.body;

    const isUpdated = await activityModel.updateActivities(id, activityData);
    if (isUpdated) {
      res.status(200).send({
        message: "活动更新成功",
      });
    } else {
      res.status(404).send({
        error: "活动不存在",
        message: `未找到id为${id}的活动`,
      });
    }
  } catch (error) {
    res.status(500).send({
      error: "服务器错误",
      message: error.message,
    });
  }
};

// 删除活动
const delActivities = async (req, res) => {
  try {
    const { id } = req.params;
    const isDeleted = await activityModel.delActivities(id);
    if (isDeleted) {
      res.status(200).send({
        message: "活动删除成功",
      });
    } else {
      res.status(404).send({
        error: "活动不存在",
        message: `未找到id为${id}的活动`,
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
  getActivities,
  addActivities,
  updateActivities,
  delActivities,
};
