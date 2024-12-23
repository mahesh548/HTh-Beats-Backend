const Users = require("../../Database/Models/Users");
const utils = require("../../utils");
const signUp = async (req, res) => {
  const { username, email } = req.body;

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
  const newUser = await new Users({
    id: utils.generateId(),
    username: username,
    email: email,
    otp: await utils.sendOtp(email),
  }).save();
  return res.status(200).json({ status: true, id: newUser.id });
};
module.exports = signUp;
