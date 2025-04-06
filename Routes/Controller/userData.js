const Entity = require("../../Database/Models/Entity");
const Users = require("../../Database/Models/Users");
const Activity = require("../../Database/Models/Activity");

const userData = async (req, res) => {
  const user = req.body.user;
  try {
    const usersData = await Users.findOne({ id: user.id, email: user.email }, [
      "username",
      "id",
      "languages",
      "pic",
      "-_id",
    ]).lean();

    usersData.users_playlists = await Entity.find({ userId: user.id }, [
      "title",
      "perma_url",
      "id",
      "-_id",
      "userId",
    ]).lean();

    usersData.recently_played = await Activity.find({
      userId: user.id,
      activity: "played",
      type: { $nin: ["search", "song"] },
    })
      .sort({ updatedAt: -1 })
      .limit(10)
      .populate({
        path: "data",
        select: "id image perma_url title type name",
      })
      .lean();

    const docs = await Activity.find({
      userId: user.id,
      activity: "played",
      type: "search",
    })
      .sort({ updatedAt: -1 })
      .limit(10)
      .populate({
        path: "list",
        select: "id image perma_url title subtitle",
      })
      .lean();

    usersData.search_history = docs
      .flatMap((doc) =>
        doc.list.map((item) => ({
          ...item,
          historyId: doc._id,
          updatedAt: doc.updatedAt,
        }))
      )
      .slice(0, 10);

    return res.status(200).json({ status: true, msg: usersData, auth: true });
  } catch (error) {
    return res.status(500).json({ status: false, msg: error.message });
  }
};
module.exports = userData;
