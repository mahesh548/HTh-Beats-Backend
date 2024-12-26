const validator = require("validator");
const utils = require("../../utils");
const loginMid = async (req, res, next) => {
  const { searchId } = req.body;
  if (validator.isEmail(searchId)) {
    req.body.searchId = {
      id: validator.normalizeEmail(searchId),
      type: "email",
    };
    return next();
  }
  if (utils.isValidUsername(searchId)) {
    req.body.searchId = {
      id: validator.escape(searchId),
      type: "username",
    };
    return next();
  }

  return res.status(400).json({ status: false, msg: "invalid input!" });
};
module.exports = loginMid;
