const validator = require("validator");
const utils = require("../../utils");
const userMailValidator = async (req, res, next) => {
  const { username, email } = req.body;

  if (!utils.isValidUsername(username)) {
    return res.status(400).json({ status: false, msg: "invalid username!" });
  }

  // Validate email
  if (!validator.isEmail(email)) {
    return res.status(400).json({ status: false, msg: "invalid email!" });
  }

  req.body.username = validator.escape(username);
  req.body.email = validator.normalizeEmail(email);

  next();
};
module.exports = userMailValidator;
