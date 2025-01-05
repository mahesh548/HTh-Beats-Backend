const Library = require("../../Database/Models/Library");

const deleteSave = async (req, res) => {
  const { savedData, user } = req.body;
  console.log(savedData);
  if (!savedData)
    return res.status(200).json({ status: false, msg: "invalid input!" });
  try {
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
module.exports = deleteSave;
