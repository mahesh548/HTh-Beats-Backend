const Activity = require("../../Database/Models/Activity");

const getActivity = async (req, res) => {
  const { id } = req.body.user;
  try {
    const activityData = await Activity.find({ userId: id })
      .limit(20)
      .sort({ createdAt: -1 });
    return res.status(200).json({ status: true, data: activityData });
  } catch (error) {
    return res.status(500).json({ status: false, msg: error.message });
  }
};
module.exports = getActivity;
