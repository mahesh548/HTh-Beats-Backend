const Users = require("../../Database/Models/Users");
const utils = require("../../utils");
const Entity = require("../../Database/Models/Entity");

const signUp = async (req, res) => {
  const { username, email } = req.body;

  try {
    const checkMailExist = await Users.findOne({ email });

    if (checkMailExist) {
      if (checkMailExist.verified)
        return res
          .status(200)
          .json({ status: false, field: "email", msg: "email already exist!" });

      if (utils.dura(checkMailExist.createdAt).min < 30)
        return res
          .status(200)
          .json({ status: false, field: "email", msg: "email already exist!" });

      await Users.deleteOne({ _id: checkMailExist._id });
      await Entity.deleteOne({ id: checkMailExist.id });
    }

    const checkUsernameExist = await Users.findOne({ username });
    if (checkUsernameExist) {
      if (checkUsernameExist.verified)
        return res.status(200).json({
          status: false,
          field: "username",
          msg: "username already exist!",
        });

      if (utils.dura(checkUsernameExist.createdAt).min < 30)
        return res.status(200).json({
          status: false,
          field: "username",
          msg: "username already exist!",
        });

      await Users.deleteOne({ _id: checkUsernameExist._id });
      await Entity.deleteOne({ id: checkUsernameExist.id });
    }
    const newUserId = utils.generateId();
    const newUser = await new Users({
      id: newUserId,
      username: username,
      email: email,
      otp: await utils.sendOtp(email, username),
    }).save();

    await new Entity({
      id: newUserId,
      perma_url: newUserId,
      title: "Liked Songs",
      type: "playlist",
      image: process.env.LIKE_ICON,
      idList: [],
      list: [],
      userId: [newUserId],
    }).save();
    const mailHint = email.charAt(0) + "****@" + email.split("@")[1];
    return res
      .status(200)
      .json({ status: true, id: newUser.id, mailHint: mailHint });
  } catch (error) {
    res.status(500).json({ status: false, msg: error.message });
  }
};
module.exports = signUp;
