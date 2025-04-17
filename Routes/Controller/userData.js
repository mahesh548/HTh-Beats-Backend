const Entity = require("../../Database/Models/Entity");
const Users = require("../../Database/Models/Users");
const Activity = require("../../Database/Models/Activity");
const cloudinary = require("cloudinary").v2;

const userData = async (req, res) => {
  const user = req.body.user;
  try {
    const usersData = await Users.findOne({ id: user.id, email: user.email }, [
      "username",
      "id",
      "languages",
      "pic",
      "email",
      "-_id",
    ]).lean();
    const email = usersData.email;

    const mailHint = email.charAt(0) + "****@" + email.split("@")[1];
    usersData.email = mailHint;
    usersData.pic = await getPic(usersData.id);
    usersData.users_playlists = await Entity.find({ userId: user.id }, [
      "title",
      "perma_url",
      "id",
      "-_id",
      "userId",
    ]).lean();

    usersData.recently_played = await Activity.find({
      userId: user.id,
      activity: "played",
      type: { $nin: ["search", "song"] },
    })
      .sort({ updatedAt: -1 })
      .limit(10)
      .populate({
        path: "data",
        select: "id image perma_url title type name",
      })
      .lean();

    const docs = await Activity.find({
      userId: user.id,
      activity: "played",
      type: "search",
    })
      .sort({ updatedAt: -1 })
      .limit(10)
      .populate({
        path: "list",
        select: "id image perma_url title subtitle",
      })
      .lean();

    usersData.search_history = docs
      .flatMap((doc) =>
        doc.list.map((item) => ({
          ...item,
          historyId: doc._id,
          updatedAt: doc.updatedAt,
        }))
      )
      .slice(0, 10);

    return res.status(200).json({ status: true, msg: usersData, auth: true });
  } catch (error) {
    return res.status(500).json({ status: false, msg: error.message });
  }
};

const getPic = async (id) => {
  const usersData = await Users.findOne({
    id: id,
  });
  if (!usersData) return "";
  if (!usersData?.cloudinaryPublicId || !usersData?.cloudinaryVersion)
    return usersData?.pic;
  const signedUrl = cloudinary.url(usersData?.cloudinaryPublicId, {
    type: "authenticated",
    sign_url: true,
    secure: true,
    version: usersData?.cloudinaryVersion,
    expires_at: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 365 * 5,
  });
  usersData.pic = signedUrl;
  await usersData.save();
  return signedUrl;
};

module.exports = userData;
