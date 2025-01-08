const Entity = require("../../Database/Models/Entity");
const Library = require("../../Database/Models/Library");

const joinCollab = async (req, res) => {
  const { id, user } = req.body;
  if (!id)
    return res.status(400).json({ status: false, msg: "id is required" });

  try {
    const saveData = await Library.findOne({ id: id, type: "collab" });
    const playlistData = await Entity.findOne({ id: id });
    if (saveData && playlistData) {
      if (saveData.userId.includes(user.id)) {
        return res.status(200).json({ status: true });
      }
      saveData.userId = [...saveData.userId, user.id];
      playlistData.userId = [...playlistData.userId, user.id];
      await saveData.save();
      await playlistData.save();
      return res.status(200).json({ status: true });
    }
    return res.status(400).json({ status: false, msg: "invalid id!" });
  } catch (error) {
    return res.status(500).json({ status: false, msg: error.message });
  }
};
module.exports = joinCollab;
