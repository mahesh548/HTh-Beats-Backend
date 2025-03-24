const Entity = require("../../Database/Models/Entity");
const Library = require("../../Database/Models/Library");
const utils = require("../../utils");

const deleteSave = async (req, res) => {
  const { savedData, user } = req.body;

  if (!savedData || savedData?.id?.length == 0 || savedData?.type?.length == 0)
    return res
      .status(200)
      .json({ status: false, msg: "invalid input!", delete: false });
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
    }).lean();
    if (!libraryData)
      return res
        .status(200)
        .json({ status: false, msg: "invalid id!", delete: false });
    //get playlist if library is playlist
    const playlistData = await Entity.findOne({
      id: libraryData.id,
      perma_url: libraryData.id,
      type: "playlist",
    }).lean();

    if (playlistData && playlistData?.type == "playlist") {
      //check type of playlist
      const playlistType = checkPlaylistType(playlistData, user.id);

      if (playlistType == "private" && playlistData.owner == user.id) {
        // if playlist is private and user own the playlist then delete playlist
        await Entity.deleteOne({
          id: libraryData.id,
          perma_url: libraryData.id,
        });
      }
      if (playlistType == "collab") {
        //if playlist is collab then check if user own playlist or just member
        if (playlistData.owner == user.id) {
          //user own the collab playlist then delete playlist and later the library
          await Entity.deleteOne({
            id: libraryData.id,
            perma_url: libraryData.id,
          });
        } else {
          // if user do not own the playlist then remove him/her from playlist and library
          let oldUserId = playlistData.userId;
          oldUserId.splice(oldUserId.indexOf(user.id), 1);
          libraryData.userId = oldUserId;
          playlistData.userId = oldUserId;

          //save the changes
          await Entity.updateOne(
            {
              id: libraryData.id,
              perma_url: libraryData.id,
              type: "playlist",
            },
            { $set: playlistData }
          );
          await Library.updateOne(
            {
              userId: { $in: [user.id] },
              id: savedData.id,
              type: savedData.type,
            },
            { $set: libraryData }
          );
          return res.status(200).json({ status: true, delete: true });
        }
      }
    }

    // delete library
    await Library.deleteOne({
      userId: { $in: [user.id] },
      id: savedData.id,
      type: savedData.type,
    });
    return res.status(200).json({ status: true, delete: true });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, msg: error.message, delete: false });
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
      await Entity.updateOne(
        {
          id: playlistId,
          perma_url: playlistId,
          type: "playlist",
        },
        { $set: playlistData }
      );
    } else {
      return {
        status: false,
        msg: "playlist not belongs to user!",
        delete: false,
      };
    }
  }
  return { status: true, delete: true };
};
const checkPlaylistType = (response, userId) => {
  if (response?.type == "playlist") {
    if (response.hasOwnProperty("userId") && response.userId.length > 0) {
      if (
        response.userId.includes("viewOnly") &&
        !response.userId.includes(userId)
      )
        return "viewOnly";
      return response.userId.filter((item) => item != "viewOnly").length > 1
        ? "collab"
        : response.userId.length == 1 &&
          response.userId[0] == userId &&
          response.id == userId
        ? "liked"
        : "private";
    }
  }
  return "entity";
};
module.exports = deleteSave;
