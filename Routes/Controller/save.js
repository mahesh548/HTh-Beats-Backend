const Library = require("../../Database/Models/Library");
const Artist = require("../../Database/Models/Artist");
const Entity = require("../../Database/Models/Entity");
const utils = require("../../utils");
const Activity = require("../../Database/Models/Activity");
const save = async (req, res) => {
  const { savedData, user } = req.body;
  if (!savedData)
    return res.status(200).json({ status: false, msg: "invalid input!" });
  try {
    const { id, type } = savedData;
    if (type == "song") {
      const responseData = await saveSong(savedData, user);
      return res.status(200).json(responseData);
    }

    const exist = await checkExist(id, type);
    if (!exist || id == user.id)
      return res.status(400).json({ status: false, msg: "invalid id" });

    await Library.deleteOne({ id: id, userId: { $in: [user.id] }, type: type });
    await new Library({ id, type, userId: [user.id] }).save();
    /* await Activity.saveLog({
      userId: user.id,
      activity: "saved",
      id: id,
      type: type,
    }); */
    return res.status(200).json({ status: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, msg: error.message });
  }
};

const saveSong = async (savedData, user) => {
  const { id, playlistIds } = savedData;

  for (const playlistId of playlistIds) {
    const playlist = await Entity.findOne({ id: playlistId });

    if (
      utils.isPrivate(playlist?.userId, user.id) ||
      utils.isCollab(playlist?.userId, user.id)
    ) {
      let oldSongs = playlist.idList.filter((item) => !id.includes(item));
      playlist.idList = [...id, ...oldSongs];
      playlist.save();
      /* await Activity.saveLog({
      userId: user.id,
      activity: "saved",
      id: playlistId,
      type: "entity",
      idList: id,
    }); */
    } else {
      return { status: false, msg: "invalid playlist id!" };
    }
  }
  return { status: true };
};

const checkExist = async (id, type) => {
  let data;
  if (type == "entity") {
    data = await Entity.findOne({ id: id });
  }
  if (type == "artist") {
    data = await Artist.findOne({ artistId: id });
  }

  if (data) {
    return true;
  } else {
    return false;
  }
};

module.exports = save;
