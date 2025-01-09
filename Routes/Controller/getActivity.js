const Activity = require("../../Database/Models/Activity");

const getActivity = async (req, res) => {
  const { id } = req.body.user;
  const { page } = req?.query?.page || 0;
  try {
    const activityData = await Activity.find({ userId: id })
      .skip(parseInt(page * 20))
      .limit(20)
      .sort({ createdAt: -1 })
      .populate({
        path: "data",
        select:
          "id image perma_url title subtitle type name fan_count play_count",
      })
      .populate({
        path: "list",
        select: "id image perma_url title subtitle",
      });

    return res.status(200).json({ status: true, data: activityData });
  } catch (error) {
    return res.status(500).json({ status: false, msg: error.message });
  }
};
module.exports = getActivity;
