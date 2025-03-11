const Entity = require("../../Database/Models/Entity");
const Library = require("../../Database/Models/Library");

const getSave = async (req, res) => {
  const { id } = req.body.user;
  const { page } = req?.query?.page || 0;
  try {
    let savedData = await Library.find({ userId: { $in: [id] } }, [
      "id",
      "type",
      "userId",
    ])
      .skip(parseInt(page * 10))
      .limit(10)
      .populate({
        path: "data",
        select:
          "id image perma_url title  type name fan_count updatedAt list_count",
      });

    const getLiked = await Entity.findOne(
      { id: id, perma_url: id },
      "-idList -list -__v -_id"
    );
    const liked = { id: id, type: "liked", userId: [id], data: getLiked };
    savedData = [liked, ...savedData];

    return res.status(200).json({ status: true, data: savedData });
  } catch (error) {
    return res.status(500).json({ status: false, msg: error.message });
  }
};
module.exports = getSave;
