const Users = require("../../Database/Models/Users");
const jwt = require("jsonwebtoken");
const utils = require("../../utils");
const otpVerify = async (req, res) => {
  const { id, otp } = req.body;
  const unverifiedUser = await Users.findOne({ id, otp });

  if (unverifiedUser) {
    const sessionId = utils.generateId();
    const userData = {
      id: id,
      email: unverifiedUser.email,
      session: sessionId,
    };
    const secrate = process.env.SECRATE;

    const session = jwt.sign(userData, secrate, { expiresIn: "30d" });

    await Users.updateOne(
      { id, otp },
      {
        $set: { verified: true, session: sessionId },
        $unset: { otp: 1 },
      }
    );

    res.setHeader("session", session);
    return res.status(200).json({ status: true });
  }
  return res.status(200).json({ status: false, msg: "invalid otp!" });
};
module.exports = otpVerify;
