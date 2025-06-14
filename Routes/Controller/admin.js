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

module.exports = admin;
