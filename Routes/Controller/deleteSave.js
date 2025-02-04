const Entity = require("../../Database/Models/Entity");
const Library = require("../../Database/Models/Library");
const utils = require("../../utils");

const deleteSave = async (req, res) => {
  const { savedData, user } = req.body;

  if (!savedData || savedData?.id?.length == 0 || savedData?.type?.length == 0)
    return res.status(200).json({ status: false, msg: "invalid input!" });
  try {
    if (savedData.type == "song") {
      const responseData = await deleteSongs(savedData, user);
      return res.status(200).json(responseData);
    }
    //checking if library exist
    const libraryData = await Library.findOne({
      userId: { $in: [user.id] },
      id: savedData.id,
      type: savedData.type,
    });
    if (!libraryData)
      return res.status(200).json({ status: false, msg: "invalid id!" });

    if (libraryData.type == "collab") {
      if (libraryData.userId.length == 1) {
        //if type is collab and only one user in collab then delete playlist
        await Entity.deleteOne({
          id: libraryData.id,
          perma_url: libraryData.id,
        });
      } else {
        //id type is collab but user is more than one then remove user and update library+playlist
        const playlistData = await Entity.findOne({
          id: libraryData.id,
          perma_url: libraryData.id,
        });
        let oldUserId = libraryData.userId;
        oldUserId.splice(oldUserId.indexOf(user.id), 1);
        libraryData.userId = oldUserId;
        playlistData.userId = oldUserId;
        await playlistData.save();
        await libraryData.save();
        return res.status(200).json({ status: true });
      }
    }
    if (libraryData.type == "private") {
      // if library is private then delete playlist
      await Entity.deleteOne({ id: libraryData.id, perma_url: libraryData.id });
    }
    // if collab has only one user or if type if private,artist,playlist then delete library
    await Library.deleteOne({
      userId: { $in: [user.id] },
      id: savedData.id,
      type: savedData.type,
    });
    return res.status(200).json({ status: true });
  } catch (error) {
    return res.status(500).json({ status: false, msg: error.message });
  }
};

const deleteSongs = async (savedData, user) => {
  const { id, playlistIds } = savedData;

  for (const playlistId of playlistIds) {
    //checking if library exist
    const playlistData = await Entity.findOne({
      id: playlistId,
      perma_url: playlistId,
    });
    if (
      utils.isPrivate(playlistData?.userId, user.id) ||
      utils.isCollab(playlistData?.userId, user.id)
    ) {
      const newSongs = playlistData.idList.filter((item) => !id.includes(item));
      playlistData.idList = newSongs;
      playlistData.save();
    } else {
      return { status: false, msg: "playlist not belongs to user!" };
    }
  }
  return { status: true };
};
module.exports = deleteSave;
