const Users = require("../../Database/Models/Users");
const otpVerify = async (req, res) => {
  const { id, otp } = req.body;
  const unverifiedUser = await Users.findOne({ id, otp });

  if (unverifiedUser) {
    await Users.updateOne(
      { id, otp },
      {
        $set: { verified: true, session: "session1234567890wdjwiofiojojie" },
        $unset: { otp: 1 },
      }
    );
    return res.status(200).json({ status: true, session: "session" });
  }
  return res.status(400).json({ status: false, msg: "invalid otp!" });
};
module.exports = otpVerify;
