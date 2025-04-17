const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
const uploadPic = async (req, res) => {
  const user = req.body.user;
  try {
    if (!req.file)
      return res
        .status(200)
        .json({ status: false, uploaded: false, msg: "file not allowed!" });

    const result = await streamUpload(req.file.buffer, user.id);

    const signedUrl = cloudinary.url(result.public_id, {
      type: "authenticated",
      sign_url: true,
      secure: true,
      version: result.version,
      expires_at: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 365 * 20,
    });

    res.json({
      status: true,
      uploaded: true,
      msg: "Uploaded successfully",
      url: signedUrl,
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
