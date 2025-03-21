const Entity = require("../../Database/Models/Entity");
const Library = require("../../Database/Models/Library");
const utils = require("../../utils");
const Activity = require("../../Database/Models/Activity");
const validator = require("validator");
const createPlaylist = async (req, res) => {
  const { playlistData, user } = req.body;

  if (!playlistData)
    return res
      .status(400)
      .json({ status: false, msg: "playlist title required!" });

  try {
    if (
      !validator.isLength(playlistData.title, { min: 1, max: 50 }) ||
      !validator.matches(playlistData.title, /^[a-zA-Z0-9 ]+$/)
    )
      return res.status(400).json({ status: false, msg: "invalid title!" });
    const playlistId = utils.generateRandomId(20);

    const title = validator.escape(playlistData.title);
    const song =
      Array.isArray(playlistData.songs) &&
      playlistData.songs.every(
        (item) => typeof item === "string" && validator.isAscii(item)
      )
        ? playlistData.songs
        : [];

    //creating new entity entry
    await new Entity({
      id: playlistId,
      perma_url: playlistId,
      owner: user.id,
      title: title,
      image: process.env.PLAYLIST_ICON,
      userId: [user.id, "viewOnly"],
      idList: song,
      type: "playlist",
    }).save();

    //creating new library entry
    await new Library({
      id: playlistId,
      userId: [user.id, "viewOnly"],
      type: "entity",
    }).save();

    /*   await Activity.saveLog({
      userId: user.id,
      activity: "created",
      id: playlistId,
      type: type,
      idList: song,
    }); */

    return res.status(200).json({ status: true, id: playlistId });
  } catch (error) {
    return res.status(500).json({ status: false, msg: error.messsage });
  }
};
module.exports = createPlaylist;
