const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
const Users = require("../../Database/Models/Users");
const uploadPic = async (req, res) => {
  const user = req.body.user;
  try {
    if (!req.file)
      return res
        .status(200)
        .json({ status: false, uploaded: false, msg: "file not allowed!" });

    const userData = await Users.findOne({
      id: user.id,
    });
    if (!userData)
      return res.status(400).json({ status: false, uploaded: false });

    //uploading to cloudinary
    const result = await streamUpload(req.file.buffer, user.id);
    const publicId = result.public_id;
    const versionCode = result.version;

    if (userData.cloudinaryPublicId && publicId && versionCode) {
      //if user already have uploaded profile pic delete that
      try {
        await cloudinary.uploader.destroy(userData.cloudinaryPublicId, {
          resource_type: "image",
          type: "authenticated",
        });
      } catch (err) {
        console.error("Error deleting old image:", err.message);
      }
    }

    if (publicId && versionCode) {
      //generate signed url using public id
      const signedUrl = cloudinary.url(publicId, {
        type: "authenticated",
        sign_url: true,
        secure: true,
        version: versionCode,
        expires_at: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 365 * 5,
      });

      //update the user data in DB
      await Users.findOneAndUpdate(
        { id: user.id },
        {
          $set: {
            pic: signedUrl,
            cloudinaryPublicId: publicId,
            cloudinaryVersion: versionCode,
          },
        }
      );
    }

    res.json({
      status: true,
      uploaded: true,
      msg: "Uploaded successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: false,
      uploaded: false,
      msg: err.message || "Upload failed",
    });
  }
};

const streamUpload = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "profile-pic",
        type: "authenticated",
        resource_type: "image",
        access_mode: "authenticated",
      },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

module.exports = uploadPic;
