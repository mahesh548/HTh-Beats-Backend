const Activity = require("../../Database/Models/Activity");

const deleteActivity = async (req, res) => {
  const { id } = req.body.user;
  const { deleteData } = req.body;
  if (
    !deleteData ||
    !deleteData?.historyIds ||
    deleteData?.historyIds?.length == 0
  )
    return res
      .status(400)
      .json({ status: false, delete: false, msg: "History _id is required" });
  try {
    if (deleteData?.type == "search") {
      //removing specific song from search history
      if (!deleteData?.idList || deleteData?.idList?.length == 0)
        return res
          .status(400)
          .json({ status: false, delete: false, msg: "idList is required" });

      if (
        deleteData.historyIds.includes("all") &&
        deleteData.idList.includes("all")
      ) {
        await Activity.deleteMany({
          userId: id,
          type: "search",
          activity: "played",
        });

        return res.status(200).json({
          status: true,
          delete: true,
        });
      }

      //removeing idList from activity
      await Activity.updateMany(
        {
          _id: { $in: deleteData.historyIds },
          userId: id,
          type: "search",
        },
        {
          $pull: {
            idList: { $in: deleteData.idList },
          },
        }
      );
      //if idList is empty then remove the activity
      await Activity.deleteMany({
        _id: { $in: deleteData.historyIds },
        userId: id,
        type: "search",
        idList: { $size: 0 },
      });

      return res.status(200).json({
        status: true,
        delete: true,
      });
    }

    if (deleteData.historyIds.includes("all")) {
      //deleting user's all activity.
      await Activity.deleteMany({
        userId: id,
      });
    } else {
      //removing play and search history from activity collection
      await Activity.deleteMany({
        userId: id,
        _id: { $in: deleteData.historyIds },
      });
    }

    return res.status(200).json({
      status: true,
      delete: true,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, delete: false, msg: error.message });
  }
};
module.exports = deleteActivity;
