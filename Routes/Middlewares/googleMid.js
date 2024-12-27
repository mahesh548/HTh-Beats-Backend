const axios = require("axios");
const { OAuth2Client } = require("google-auth-library");
const CLIENT_ID = process.env.MY_CLIENT_ID;
const client = new OAuth2Client(CLIENT_ID);
const googleMid = async (req, res, next) => {
  const { token } = req.body;

  if (!token) return res.status(400).json({ status: false, msg: "no token!" });

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });
    const payload = ticket.getPayload();

    req.body.email = payload.email;
    req.body.pic = payload.picture;
    next();
  } catch (error) {
    return res.status(500).json({ status: false, msg: error.message });
  }
};
module.exports = googleMid;
