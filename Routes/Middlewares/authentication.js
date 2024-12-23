const jwt = require("jsonwebtoken");
const auth = async (req, res, next) => {
  const { session } = req.cookies;
  if (!session) return res.status(401).json({ status: false, auth: false });
  const secrate = process.env.SECRATE;
  try {
    const user = jwt.verify(session, secrate);
    req.body.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ status: false, auth: false });
  }
};
module.exports = auth;
