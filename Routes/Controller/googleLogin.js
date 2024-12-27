const Users = require("../../Database/Models/Users");
const jwt = require("jsonwebtoken");
const googleLogin = async (req, res) => {
  const { email } = req.body;
  const user = await Users.findOne({ email });
  if (!user)
    return res.status(200).json({ status: false, msg: "email not exist!" });
  const userData = {
    id: user.id,
    email: email,
  };
  const secrate = process.env.SECRATE;
  const session = jwt.sign(userData, secrate);

  await Users.updateOne(
    { id: user.id, email: email },
    {
      $set: { session: session },
    }
  );
  res.cookie("session", session, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
  return res.status(200).json({ status: true });
};
module.exports = googleLogin;
