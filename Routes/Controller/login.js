const Users = require("../../Database/Models/Users");
const utils = require("../../utils");
const login = async (req, res) => {
  const { id, type } = req.body.searchId;
  const search = type == "email" ? { email: id } : { username: id };
  const user = await Users.findOne(search);
  if (user) {
    user.otp = await utils.sendOtp(user.email);
    user.save();
    return res.status(200).json({ status: true, id: user.id });
  }
  const msg = type == "email" ? "Email not exist!" : "Username not exist!";
  res.status(200).json({ status: false, msg: msg });
};
module.exports = login;
