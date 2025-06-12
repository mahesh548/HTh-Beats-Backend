const Users = require("../../Database/Models/Users");

const updateDownload = async (req, res) => {
  const { accessData, user } = req.body;
  if (!accessData)
    return res.status(200).json({ status: false, msg: "invalid input!" });

  try {
    const { access } = accessData;
    if (!access)
      return res.status(400).json({ status: false, msg: "invalid input!" });

    if (access === "requested") {
      await Users.updateOne(
        { id: user.id },
        { $set: { downloadAccess: "requested" } }
      );

      return res
        .status(200)
        .json({ status: true, msg: "Download access requested successfully!" });
    }

    if (access === "approved" || access === "default") {
      const { targetId } = accessData;
      if (!targetId)
        return res.status(400).json({ status: false, msg: "invalid input!" });
      const adminData = await Users.findOne({ id: user.id, role: "admin" });
      if (!adminData)
        return res
          .status(403)
          .json({ status: false, msg: "unauthorized access!" });

      await Users.updateOne(
        { id: targetId },
        { $set: { downloadAccess: access } }
      );

      return res
        .status(200)
        .json({ status: true, msg: "Download access updated successfully!" });
    }

    return res.status(200).json({ status: false, msg: "invalid access type!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false });
  }
};
module.exports = updateDownload;
