const userData = async (req, res) => {
  console.log(req.body.user);
  res.status(200).json({ status: true, msg: "userdata" });
};
module.exports = userData;
