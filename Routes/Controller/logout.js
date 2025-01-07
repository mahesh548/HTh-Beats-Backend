const Users = require("../../Database/Models/Users");

const logout = async (req, res) => {
  const { id, email } = req.body.user;
  try {
    await Users.updateOne({ id, email }, { $set: { session: null } });
    res.setHeaders("session", null);
    return res.status(200).json({ status: true });
  } catch (error) {
    return res.status(500).json({ status: false, msg: error.message });
  }
};
module.exports = logout;
