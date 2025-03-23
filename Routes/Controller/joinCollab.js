const Entity = require("../../Database/Models/Entity");
const Library = require("../../Database/Models/Library");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const joinCollab = async (req, res) => {
  const { token, user } = req.body;
  if (!validator.isJWT(token))
    return res
      .status(400)
      .json({ status: false, msg: "invite token required!" });

  try {
    //verify and get library secrate from jwt
    const secrate = process.env.SECRATE;
    const { id, librarySecrate } = jwt.verify(token, secrate);

    //getting lirary with librarySecrate included
    const verifyData = await Library.findOne({
      id: id,
    }).select("+librarySecrate");

    //verify if librarySecrate matches secrate stored in token
    if (!verifyData && verifyData.librarySecrate != librarySecrate)
      return res
        .status(200)
        .json({ status: false, msg: "playlist unavailable!" });

    //get the saved library and playlist
    const saveData = await Library.findOne({ id: id });
    const playlistData = await Entity.findOne({ id: id });

    if (saveData && playlistData) {
      //return if already user exist
      if (saveData.userId.includes(user.id)) {
        return res.status(200).json({ status: true, playlistId: id });
      }

      //add the user
      saveData.userId = [...saveData.userId, user.id];
      playlistData.userId = [...playlistData.userId, user.id];

      //save the doc
      await saveData.save();
      await playlistData.save();

      /* await Activity.saveLog({
        userId: user.id,
        activity: "joined",
        id: id,
        type: "collab",
      }); */

      return res.status(200).json({ status: true, playlistId: id });
    }
    return res.status(400).json({ status: false, msg: "invalid id!" });
  } catch (error) {
    return res
      .status(200)
      .json({ status: false, msg: "playlist unavailable!" });
  }
};
module.exports = joinCollab;
