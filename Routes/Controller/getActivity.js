const Activity = require("../../Database/Models/Activity");

const getActivity = async (req, res) => {
  const { id } = req.body.user;
  const page = Math.max(Number(req?.query?.page) || 1, 1);
  try {
    const limit = 20;
    const skip = (page - 1) * limit;
    const query = { userId: id };
    const activityData = await Activity.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate({
        path: "data",
        select: "id image perma_url title type name",
      })
      .populate({
        path: "list",
        select: "id image perma_url title subtitle",
      });

    const totalItems = await Activity.countDocuments(query);

    return res.status(200).json({
      status: true,
      data: activityData,
      hasMore: totalItems > page * limit,
      page: page,
    });
  } catch (error) {
    return res.status(500).json({ status: false, msg: error.message });
  }
};
module.exports = getActivity;
