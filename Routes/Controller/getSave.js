const Library = require("../../Database/Models/Library");

const getSave = async (req, res) => {
  const { id } = req.body.user;
  try {
    const savedData = await Library.find({ userId: { $in: [id] } }, [
      "id",
      "type",
    ])
      .limit(10)
      .populate("data");
    console.log(savedData);
    return res.status(200).json({ status: true, data: savedData });
  } catch (error) {
    return res.status(500).json({ status: false, msg: error.message });
  }
};
module.exports = getSave;
