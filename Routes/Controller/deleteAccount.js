const Activity = require("../../Database/Models/Activity");
const Entity = require("../../Database/Models/Entity");
const Library = require("../../Database/Models/Library");
const Users = require("../../Database/Models/Users");
const cloudinary = require("cloudinary").v2;

const deleteAccount = async (req, res) => {
  const user = req.body.user;
  if (!user) return res.status(400).json({ status: false, delete: false });

  try {
    const usersData = await Users.findOne({
      id: user.id,
    }).lean();

    if (
      usersData &&
      usersData?.cloudinaryPublicId &&
      usersData?.cloudinaryVersion
    ) {
      //if user have uploaded a profile pic delete it.
      await cloudinary.uploader.destroy(usersData.cloudinaryPublicId, {
        resource_type: "image",
        type: "authenticated",
      });
    }
    //delete user's all activity
    await Activity.deleteMany({
      userId: user.id,
    });

    //delete all playlist created by user
    await Entity.deleteMany({
      owner: user.id,
    });
    //delete user's like list
    await Entity.deleteOne({
      id: user.id,
      perma_url: user.id,
    });
    //delete user's library
    await Library.deleteMany({
      userId: {
        $all: [user.id, "viewOnly"],
        $size: 2,
      },
    });

    //delete user
    await Users.deleteOne({
      id: user.id,
    });

    res.status(200).json({ status: true, delete: true });
  } catch (error) {
    res.status(500).json({ status: false, delete: false });
  }
};
module.exports = deleteAccount;
