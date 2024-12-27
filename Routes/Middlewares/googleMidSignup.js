const Users = require("../../Database/Models/Users");
const utils = require("../../utils");
const validator = require("validator");
const googleMidSignup = async (req, res, next) => {
  const { username } = req.body;
  const validUsername = utils.isValidUsername(username);
  if (!validUsername)
    return res.status(200).json({ status: false, msg: "Invalid Username!" });

  const user = await Users.findOne({ username });
  if (user)
    return res
      .status(200)
      .json({ status: false, msg: "Username Already Exist!" });

  req.body.username = validator.escape(username);
  next();
};
module.exports = googleMidSignup;
