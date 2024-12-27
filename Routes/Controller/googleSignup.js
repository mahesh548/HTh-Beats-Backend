const Users = require("../../Database/Models/Users");
const utils = require("../../utils");
const jwt = require("jsonwebtoken");
const googleSignup = async (req, res) => {
  const { username, email, pic } = req.body;

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
    }
    const newUserId = utils.generateId();
    const userData = {
      id: newUserId,
      email: email,
    };
    const secrate = process.env.SECRATE;
    const session = jwt.sign(userData, secrate);
    const newUser = await new Users({
      id: newUserId,
      username: username,
      email: email,
      pic: pic,
      verified: true,
      session: session,
    }).save();

    res.cookie("session", session, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({ status: true, id: newUserId });
  } catch (error) {
    return res.status(500).json({ status: false, msg: error.message });
  }
};
module.exports = googleSignup;
