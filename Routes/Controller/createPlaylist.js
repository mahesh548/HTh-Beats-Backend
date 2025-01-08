const Entity = require("../../Database/Models/Entity");
const Library = require("../../Database/Models/Library");
const utils = require("../../utils");

const createPlaylist = async (req, res) => {
  const { playlistData, user } = req.body;

  if (!playlistData)
    return res
      .status(400)
      .json({ status: false, msg: "playlist title required!" });

  try {
    const playlistId = utils.generateRandomId(20);
    const { title, type, song } = playlistData;
    await new Entity({
      id: playlistId,
      perma_url: playlistId,
      title: title,
      image: "default",
      userId: [user.id],
      idList: song,
      type: "playlist",
    }).save();
    await new Library({
      id: playlistId,
      userId: [user.id],
      type: type,
    }).save();
    return res.status(200).json({ status: true });
  } catch (error) {
    return res.status(500).json({ status: false, msg: error.messsage });
  }
};
module.exports = createPlaylist;
