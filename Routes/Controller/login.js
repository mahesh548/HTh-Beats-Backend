const Users = require("../../Database/Models/Users");
const utils = require("../../utils");
const login = async (req, res) => {
  try {
    const { id, type } = req.body.searchId;
    const search = type == "email" ? { email: id } : { username: id };
    const user = await Users.findOne(search);
    if (user) {
      const email = user.email;
      user.otp = await utils.sendOtp(user.email);
      user.save();
      console.log(email);
      const mailHint = email.charAt(0) + "****@" + email.split("@")[1];
      return res
        .status(200)
        .json({ status: true, id: user.id, mailHint: mailHint });
    }
    const msg = type == "email" ? "Email not exist!" : "Username not exist!";
    res.status(200).json({ status: false, msg: msg });
  } catch (error) {
    return res.status(500).json({ status: false, msg: error.message });
  }
};
module.exports = login;
