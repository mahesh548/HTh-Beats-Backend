const Users = require("../../Database/Models/Users");
const jwt = require("jsonwebtoken");
const utils = require("../../utils");
const googleLogin = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await Users.findOne({ email });
    if (!user)
      return res.status(200).json({ status: false, msg: "email not exist!" });
    const sessionId = utils.generateId();
    const userData = {
      id: user.id,
      email: email,
      session: sessionId,
    };
    const secrate = process.env.SECRATE;
    const session = jwt.sign(userData, secrate, { expiresIn: "30d" });

    await Users.updateOne(
      { id: user.id, email: email },
      {
        $set: { session: sessionId },
      }
    );
    res.setHeader("session", session);
    return res.status(200).json({ status: true });
  } catch (error) {
    return res.status(500).json({ status: false, msg: error.message });
  }
};
module.exports = googleLogin;
