const Users = require("../../Database/Models/Users");
const utils = require("../../utils");

const updateDownload = async (req, res) => {
  const { accessData, user } = req.body;
  if (!accessData)
    return res.status(200).json({ status: false, msg: "invalid input!" });

  try {
    const { access } = accessData;
    if (!access)
      return res.status(400).json({ status: false, msg: "invalid input!" });

    if (access === "requested") {
      const updatedUser = await Users.findOneAndUpdate(
        { id: user.id },
        { $set: { downloadAccess: "requested" } },
        { new: true }
      );

      let adminsMail = await Users.find({ role: "admin" }, [
        "email",
        "username",
      ]);
      adminsMail = adminsMail.map((item) => {
        return { email: item.email, name: item.username };
      });

      sendEmail(updatedUser?.username, adminsMail, "request");

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

      const updatedUser = await Users.findOneAndUpdate(
        { id: targetId },
        { $set: { downloadAccess: access } },
        { new: true }
      );

      sendEmail(
        updatedUser?.username,
        [{ email: updatedUser?.email, name: updatedUser?.username }],
        access
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

const sendEmail = async (username, emails, type) => {
  if (!username || !emails || !type) return;
  let message = "";
  let subject = "";
  if (type == "request") {
    const pending = await Users.countDocuments({ downloadAccess: "requested" });
    subject = `${pending} Pending Download Request${
      pending > 1 ? "s" : ""
    } - Action Required`;

    message =
      `Dear HTh Beats Admin Team,\n\n` +
      `A new download request has been submitted by user @${username}.\n\n` +
      `There are currently (${pending}) pending download request${
        pending > 1 ? "s" : ""
      } awaiting your review.\n\n` +
      `Please visit the Admin Panel to take the necessary actions:\n` +
      `${process.env.FURL}/admin\n\n` +
      `IF LINK ABOVE NOT WORKING THEN SIMPLY OPEN YOUR ACCOUNT AND ACCESS ADMIN PANEL FROM SETTINGS\n\n` +
      `Your continued support helps keep HTh Beats running smoothly and ensures a great experience for our users.\n` +
      `We appreciate your attention to this matter.\n\n` +
      `Best regards,\n` +
      `The HTh Beats Team`;
  }
  if (type == "approved") {
    subject = "Your Download Request Has Been Approved!";

    message =
      `Dear ${username},\n\n` +
      `Congratulations! Your download request has been approved, and the download feature is now unlocked for your account.\n\n` +
      `You can now enjoy downloading your favorite music directly from the app.\n\n` +
      `We kindly remind you that all downloaded content is for personal use only. Please refrain from using the material for any commercial purposes and help us maintain a piracy-free and respectful environment.\n\n` +
      `If you experience any issues accessing the download feature, please don't hesitate to contact our support team at ${process.env.SUPPORT_MAIL}.\n\n` +
      `Thank you for being a valued part of the HTh Beats community. We hope you enjoy the enhanced experience!\n\n` +
      `Best regards,\n` +
      `The HTh Beats Team`;
  }
  if (type == "default") {
    subject = "Your Download Request Was Not Approved";

    message =
      `Dear ${username},\n\n` +
      `Thank you for your interest in accessing the download feature on HTh Beats.\n\n` +
      `After reviewing your request, we regret to inform you that it has not been approved at this time.\n\n` +
      `This feature is selectively granted based on internal criteria, and unfortunately, your account did not meet the requirements for approval.\n\n` +
      `We encourage you to continue enjoying all the other features HTh Beats has to offer and welcome you to reapply in the future if needed.\n\n` +
      `If you believe this decision was made in error or if you have any questions, feel free to reach out to our support team at ${process.env.SUPPORT_MAIL}.\n\n` +
      `Thank you for being a part of the HTh Beats community.\n\n` +
      `Best regards,\n` +
      `The HTh Beats Team`;
  }
  if (!subject || !message) return;
  utils.sendMail(emails, subject, message);
};

module.exports = updateDownload;
