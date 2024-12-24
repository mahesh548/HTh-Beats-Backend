const userData = async (req, res) => {
  console.log(req.body.user);
  res.cookie("session", req.body.token, {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
  res.status(200).json({ status: true, msg: "userdata", auth: true });
};
module.exports = userData;
