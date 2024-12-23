const validator = require("validator");
const userMailValidator = async (req, res, next) => {
  const { username, email } = req.body;

  const isValidUsername = validator.matches(username, /^[a-zA-Z0-9_.]+$/);
  if (!isValidUsername) {
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
