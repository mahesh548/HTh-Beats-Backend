const Library = require("../../Database/Models/Library");
const Artist = require("../../Database/Models/Artist");
const Entity = require("../../Database/Models/Entity");
const utils = require("../../utils");
const save = async (req, res) => {
  const { saveData, user } = req.body;
  if (!saveData)
    return res.status(200).json({ status: false, msg: "invalid input!" });
  try {
    const { id, type } = saveData;
    if (type == "song") {
      const responseData = await saveSong(saveData, user);
      return res.status(200).json(responseData);
    }

    const exist = await checkExist(id, type);
    if (!exist)
      return res.status(400).json({ status: false, msg: "invalid id" });

    await Library.deleteOne({ id: id, userId: { $in: [user.id] }, type: type });
    await new Library({ id, type, userId: [user.id] }).save();
    return res.status(200).json({ status: true });
  } catch (error) {
    return res.status(500).json({ status: false, msg: error.message });
  }
};

const saveSong = async (saveData, user) => {
  const { id, playlistId } = saveData;
  const playlist = await Entity.findOne({ id: playlistId });

  if (
    utils.isPrivate(playlist?.userId, user.id) ||
    utils.isCollab(playlist?.userId, user.id)
  ) {
    let oldSongs = playlist.idList.filter((item) => !id.includes(item));
    playlist.idList = [...id, ...oldSongs];
    playlist.save();
    return { status: true };
  } else {
    return { status: false, msg: "invalid playlist id!" };
  }
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
