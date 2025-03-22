const validator = require("validator");
const Entity = require("../../Database/Models/Entity");
const Library = require("../../Database/Models/Library");

const editPlaylist = async (req, res) => {
  const { editData, user } = req.body;

  if (!editData || editData?.id?.length == 0)
    return res.status(200).json({ status: false, msg: "invalid input!" });
  try {
    //checking if library exist
    const libraryData = await Library.findOne({
      userId: { $in: [user.id] },
      id: editData.id,
    }).lean();

    //check if playlist exist and owned by user
    const playlistData = await Entity.findOne({
      id: editData.id,
      perma_url: editData.id,
      owner: user.id,
      type: "playlist",
    }).lean();

    if (!libraryData || !playlistData)
      return res.status(200).json({ status: false, msg: "invalid id!" });

    console.log("updating everything of playlist..!!");
    //editing title of playlist
    if (
      editData.hasOwnProperty("title") &&
      validator.isLength(editData.title, { min: 1, max: 50 }) &&
      validator.matches(editData.title, /^[a-zA-Z0-9 ]+$/)
    ) {
      playlistData.title = editData.title;
    }
    //editing song list of playlist
    if (
      editData.hasOwnProperty("songs") &&
      Array.isArray(editData.songs) &&
      editData.songs.every(
        (item) => typeof item === "string" && validator.isAscii(item)
      )
    ) {
      playlistData.idList = editData.songs;
    }

    //if privacy has changed
    if (editData.hasOwnProperty("privacy")) {
      const oldUserId = playlistData.userId;
      if (editData.privacy == "private") {
        //if changed to private remove viewOnly
        const newUserId = oldUserId.filter((item) => item != "viewOnly");
        playlistData.userId = newUserId;
        libraryData.userId = newUserId;
      }
      if (editData.privacy == "public") {
        //if changed to public add viewOnly
        const newUserId = oldUserId
          .filter((item) => item != "viewOnly")
          .push("viewOnly");
        playlistData.userId = newUserId;
        libraryData.userId = newUserId;
      }
    }

    //if member changed
    if (
      editData.hasOwnProperty("members") &&
      Array.isArray(editData.members) &&
      editData.members.every(
        (item) => typeof item === "string" && validator.isUUID(item)
      ) &&
      editData.members.includes(user.id)
    ) {
      //filter only user-ids that is in member except viewOnly if exist.
      const oldUserId = playlistData.userId;
      const newUserId = oldUserId.filter((item) => {
        if (item == "viewOnly") return true;
        return editData.members.includes(item);
      });
      playlistData.userId = newUserId;
      libraryData.userId = newUserId;
    }

    //save the changes
    playlistData.save();
    libraryData.save();

    return res.status(200).json({ status: true });
  } catch (error) {
    return res.status(200).json({ status: false, msg: error.message });
  }
};

module.exports = editPlaylist;
