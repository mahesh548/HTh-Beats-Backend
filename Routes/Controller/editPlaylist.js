const validator = require("validator");
const Entity = require("../../Database/Models/Entity");
const Library = require("../../Database/Models/Library");
const jwt = require("jsonwebtoken");

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

    //editing title of playlist
    if (
      editData?.title &&
      validator.isLength(editData.title, { min: 1, max: 50 }) &&
      validator.matches(editData.title, /^[a-zA-Z0-9 ]+$/)
    ) {
      playlistData.title = editData.title;
    }
    //editing song list of playlist
    if (
      editData?.list &&
      Array.isArray(editData.list) &&
      editData.list.every(
        (item) => typeof item === "string" && validator.isAscii(item)
      )
    ) {
      playlistData.idList = editData.list;
    }

    //if privacy has changed
    if (editData?.privacy) {
      const oldUserId = playlistData.userId;
      if (editData.privacy == "private") {
        //if changed to private remove viewOnly
        const newUserId = oldUserId.filter((item) => item != "viewOnly");
        playlistData.userId = newUserId;
        libraryData.userId = newUserId;
      }
      if (editData.privacy == "public") {
        //if changed to public add viewOnly
        const newUserId = oldUserId.filter((item) => item != "viewOnly");

        newUserId.push("viewOnly");
        playlistData.userId = newUserId;
        libraryData.userId = newUserId;
      }
    }

    //if member changed
    if (
      editData?.members &&
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
    //if cover changed
    if (
      editData?.img &&
      typeof editData.img === "string" &&
      validator.isURL(editData.img)
    ) {
      playlistData.image = editData.img;
    }
    //if owner wants to invite members
    let token = "";
    if (editData?.invite == true) {
      const { librarySecrate } = await Library.findOne({
        userId: { $in: [user.id] },
        id: editData.id,
      }).select("+librarySecrate");
      const secrateData = {
        id: editData.id,
        librarySecrate: librarySecrate,
      };
      const secrate = process.env.SECRATE;
      token = jwt.sign(secrateData, secrate, { expiresIn: "7d" });
    }

    //save the changes
    await Entity.updateOne(
      {
        id: editData.id,
        perma_url: editData.id,
        owner: user.id,
        type: "playlist",
      },
      { $set: playlistData }
    );
    await Library.updateOne(
      { userId: { $in: [user.id] }, id: editData.id },
      { $set: libraryData }
    );

    if (validator.isJWT(token))
      return res.status(200).json({ status: true, token: token });
    return res.status(200).json({ status: true });
  } catch (error) {
    return res.status(200).json({ status: false, msg: error.message });
  }
};

module.exports = editPlaylist;
