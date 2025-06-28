const Users = require("../../Database/Models/Users");
const Entity = require("../../Database/Models/Entity");
const Song = require("../../Database/Models/Song");
const utils = require("../../utils");
const admin = async (req, res) => {
  const { user, adminAction } = req.body;
  if (!user || user?.role !== "admin") {
    return res.status(403).json({ status: false, msg: "Unauthorized access!" });
  }
  try {
    if (!adminAction) {
      return res.status(400).json({ status: false, msg: "Invalid input!" });
    }

    if (adminAction?.action === "getCounts") {
      const totalUsers = await Users.aggregate([
        {
          $facet: {
            approved: [
              { $match: { downloadAccess: "approved" } },
              { $count: "count" },
            ],
            users: [{ $match: { role: "user" } }, { $count: "count" }],
          },
        },
      ]);

      const detailData = await Users.aggregate([
        {
          $facet: {
            admins: [
              { $match: { role: "admin" } },
              { $project: { username: 1, pic: 1, createdAt: 1 } },
            ],
            requests: [
              { $match: { downloadAccess: "requested" } },
              { $project: { username: 1, pic: 1, createdAt: 1, id: 1 } },
            ],
          },
        },
      ]);

      const UsersCount = Object.fromEntries(
        Object.entries(totalUsers[0]).map(([key, value]) => [
          key,
          value[0]?.count || 0,
        ])
      );

      UsersCount.admin = detailData[0].admins?.length || 0;
      UsersCount.request = detailData[0].requests?.length || 0;

      const totalEntity = await Entity.aggregate([
        {
          $facet: {
            playlists: [{ $match: { type: "playlist" } }, { $count: "count" }],
            albums: [{ $match: { type: "album" } }, { $count: "count" }],
            mixes: [{ $match: { type: "mix" } }, { $count: "count" }],
          },
        },
      ]);
      const EntityCount = Object.fromEntries(
        Object.entries(totalEntity[0]).map(([key, value]) => [
          key,
          value[0]?.count || 0,
        ])
      );

      const songCount = await Song.countDocuments({});
      EntityCount.songs = songCount;

      return res.status(200).json({
        status: true,
        data: { UsersCount, EntityCount, detailData: detailData[0] },
      });
    }
    if (adminAction?.action === "searchUser") {
      const { searchId } = adminAction;
      if (!searchId) {
        return res.status(400).json({ status: false, msg: "Invalid input!" });
      }
      const isValidUsername = utils.isValidUsername(searchId);
      if (!isValidUsername && !utils.isValidEmail(searchId)) {
        return res.status(400).json({ status: false, msg: "Invalid input!" });
      }

      const usersData = await Users.find(
        {
          username: { $regex: new RegExp("^" + searchId), $options: "i" },
        },
        ["username", "id", "pic", "role", "createdAt", "downloadAccess", "-_id"]
      );

      return res.status(200).json({
        status: true,
        data: usersData,
      });
    }

    if (adminAction?.action === "updateRole") {
      const { targetId, role } = adminAction;
      if (!targetId || !role) {
        return res.status(400).json({ status: false, msg: "Invalid input!" });
      }
      const validRoles = ["user", "admin"];
      if (!validRoles.includes(role)) {
        return res.status(400).json({ status: false, msg: "Invalid role!" });
      }

      const userData = await Users.findOneAndUpdate(
        { id: targetId },
        { $set: { role: role } },
        { new: true }
      );

      if (!userData) {
        return res.status(404).json({ status: false, msg: "User not found!" });
      }
      sendEmail(
        userData?.username,
        [{ email: userData?.email, name: userData?.username }],
        role
      );

      return res.status(200).json({
        status: true,
        msg: `User role updated successfully!`,
      });
    }
    return res
      .status(200)
      .json({ status: false, msg: "Invalid admin action!" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, msg: "something went wrong!" });
  }
};

const sendEmail = async (username, emails, type) => {
  if (!username || !emails || !type) return;
  let message = "";
  let subject = "";

  if (type == "admin") {
    subject = "Welcome to the HTh Beats Admin Team!";

    message =
      `Dear ${username},\n\n` +
      `Congratulations! 🎉 You have been promoted to the Admin Team on HTh Beats.\n\n` +
      `As an admin, you now have access to several new responsibilities and capabilities:\n` +
      `• Approve or deny download requests submitted by users\n` +
      `• Grant or revoke download permissions, even if a request hasn't been made\n` +
      `• Promote other users to admin or remove current admins\n` +
      `• View internal statistics related to HTh Beats' usage and activity\n\n` +
      `To access the Admin Panel, please use the link below:\n` +
      `${process.env.FURL}/admin\n\n` +
      `If the above link doesn’t work for any reason, simply open your account settings within the app and look for the “Admin Panel” button.\n\n` +
      `We trust that you will use your new role responsibly and help maintain the quality and fairness of our platform. If for any reason you do not wish to continue as an admin, you can contact our support team at ${process.env.SUPPORT_MAIL}.\n\n` +
      `Enjoy your new role, and thank you for being a valuable part of the HTh Beats community.\n\n` +
      `Best regards,\n` +
      `The HTh Beats Team`;
  }
  if (type == "user") {
    subject = "Your Admin Role Has Been Revoked on HTh Beats";

    message =
      `Dear ${username},\n\n` +
      `We’d like to inform you that your admin privileges on HTh Beats have been revoked, and your account has been returned to a regular user role.\n\n` +
      `This means you will no longer be able to:\n` +
      `• Approve or deny download requests\n` +
      `• Grant or revoke download access for users\n` +
      `• Add or remove admins\n` +
      `• View administrative statistics or privileged data\n\n` +
      `This decision was made by the HTh Beats Admin Team. We ask you to please respect this decision as part of maintaining the integrity and responsibility expected from admin roles.\n\n` +
      `However, if you believe this action was taken in error or would like clarification, feel free to contact us at ${process.env.SUPPORT_MAIL} and we’ll be happy to assist you.\n\n` +
      `Thank you for your past contributions as an admin. We hope you’ll continue enjoying HTh Beats as a valued user.\n\n` +
      `Sincerely,\n` +
      `The HTh Beats Team`;
  }
  if (!subject || !message) return;
  await utils.sendMail(emails, subject, message);
  const securityMessage =
    `Dear Mahesh,\n\n` +
    `There is new changes in HTh Beats Admin Team as @${username} has been ${
      type == "admin" ? "added to" : "removed from"
    } the Team. \n\n` +
    `New admin's email: ${emails[0]?.email} \n` +
    `New admin's username: ${emails[0]?.name} \n\n` +
    `The HTh Beats Safety System`;
  await utils.sendMail(
    [{ email: "mkmjnp5@gmail.com", name: "Mahesh" }],
    "Changes in HTh Beats Admin Team",
    securityMessage
  );
};

module.exports = admin;
