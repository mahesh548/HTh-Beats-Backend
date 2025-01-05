const Library = require("../../Database/Models/Library");

const save = async (req, res) => {
  const { saveData, user } = req.body;
  if (!saveData)
    return res.status(200).json({ status: false, msg: "invalid input!" });
  try {
    const { id, type } = saveData;
    await Library.deleteOne({ id: id, userId: { $in: [user.id] }, type: type });
    await new Library({ id, type, userId: [user.id] }).save();
    return res.status(200).json({ status: true });
  } catch (error) {
    return res.status(500).json({ status: false, msg: error.message });
  }
};

module.exports = save;
