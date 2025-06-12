const Users = require("../../Database/Models/Users");

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
            default: [
              { $match: { downloadAccess: "default" } },
              { $count: "count" },
            ],
            requested: [
              { $match: { downloadAccess: "requested" } },
              { $count: "count" },
            ],
            approved: [
              { $match: { downloadAccess: "approved" } },
              { $count: "count" },
            ],
            admin: [{ $match: { role: "admin" } }, { $count: "count" }],
            users: [{ $match: { role: "user" } }, { $count: "count" }],
          },
        },
      ]);

      const UsersCount = Object.fromEntries(
        Object.entries(totalUsers[0]).map(([key, value]) => [
          key,
          value[0]?.count || 0,
        ])
      );

      return res.status(200).json({
        status: true,
        data: { UsersCount },
      });
    }

    res.status(200).json({ status: false, msg: "Invalid admin action!" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, msg: "something went wrong!" });
  }
};

module.exports = admin;
