const cloudinary = require("cloudinary").v2;
const Users = require("../../Database/Models/Users");
const deletePic = async (req, res) => {
  const user = req.body.user;
  try {
    const userData = await Users.findOne({
      id: user.id,
    });
    if (!userData)
      return res.status(400).json({ status: false, deleted: false });

    if (userData.cloudinaryPublicId && userData.cloudinaryVersion) {
      //if user have profile pic on clodinary delete that
      try {
        await cloudinary.uploader.destroy(userData.cloudinaryPublicId, {
          resource_type: "image",
          type: "authenticated",
        });
      } catch (err) {
        console.error("Error deleting old image:", err.message);
      }
    }

    await Users.findOneAndUpdate(
      { id: user.id },
      {
        $unset: {
          pic: "",
          cloudinaryPublicId: "",
          cloudinaryVersion: "",
        },
      }
    );

    res.json({
      status: true,
      deleted: true,
      msg: "deleted successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: false,
      deleted: false,
      msg: err.message || "Upload failed",
    });
  }
};

module.exports = deletePic;
