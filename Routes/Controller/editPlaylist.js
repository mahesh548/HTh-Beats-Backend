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
    });

    //check if playlist exist and owned by user
    const playlistData = await Entity.findOne({
      id: editData.id,
      perma_url: editData.id,
      owner: user.id,
      type: "playlist",
    });

    if (!libraryData || !playlistData)
      return res.status(200).json({ status: false, msg: "invalid id!" });

    console.log("updating everything of playlist..!!");

    return res.status(200).json({ status: true });
  } catch (error) {
    return res.status(500).json({ status: false, msg: error.message });
  }
};

module.exports = editPlaylist;
