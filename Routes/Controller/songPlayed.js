const Activity = require("../../Database/Models/Activity");
const songPlayed = async (req, res) => {
  const { playedData, user } = req.body;

  if (!playedData)
    return res.status(400).json({ status: false, msg: "payload required!" });

  try {
    const { type, playlistId, idList } = playedData;
    if (!type || !idList)
      return res
        .status(400)
        .json({ status: false, msg: "type and idList is required!" });

    let id = playlistId;
    if (type == "song") id = `history_${user.id}`;
    if (type == "search") id = `search_${user.id}`;

    // save history log
    await Activity.saveLog({
      userId: user.id,
      activity: "played",
      id: id,
      type: type,
      idList: idList,
    });

    return res.status(200).json({ status: true });
  } catch (error) {
    return res.status(500).json({ status: false, msg: error.messsage });
  }
};
module.exports = songPlayed;
