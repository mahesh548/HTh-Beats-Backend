const Room = require("../../Database/Models/Room");
const utils = require("../../utils");
const jwt = require("jsonwebtoken");

const allowedEvent = ["create", "join", "delete", "block"];
const room = async (req, res) => {
  const user = req.body.user;
  const event = req?.params?.event;
  const { title } = req.body?.roomData;
  if (!allowedEvent.includes(event) || !title)
    return res.status(400).json({ status: false, msg: "event is invalid!" });

  try {
    if (event == "create") {
      //delete if there is already a room
      await Room.deleteMany({
        admin: user.id,
      });

      const roomId = utils.generateRandomId(10);

      const newRoom = await new Room({
        admin: user.id,
        title: title,
        createdAt: new Date(),
        expiredAt: new Date(Date.now() + 4 * 60 * 60 * 1000),
        id: roomId,
      }).save();
      const token = generateToken(user.id, newRoom.expiredAt, roomId);
      const response = {
        title: title,
        admin: user.id,
        clientId: user.id,
        token: token,
        roomId: roomId,
        role: "admin",
      };

      return res.status(200).json({
        status: true,
        data: response,
      });
    }
  } catch (error) {}
};

// Generate a short-lived Ably JWT token for a client
function generateToken(userId, expiry, channelId) {
  try {
    const ABLY_API_KEY = process.env.ABLY_KEY;
    if (!ABLY_API_KEY) throw new Error("ABLY_KEY not set in environment");

    const [keyName, keySecret] = ABLY_API_KEY.split(":");
    if (!keyName || !keySecret)
      throw new Error("Invalid ABLY_KEY format (expected keyName:keySecret)");

    const exp = Math.floor(new Date(expiry).getTime() / 1000);
    const iat = Math.floor(Date.now() / 1000);
    if (isNaN(exp) || exp <= iat) throw new Error("Invalid expiry timestamp");

    const capability = {
      [channelId]: ["publish", "subscribe", "presence"],
    };

    const tokenPayload = {
      iat,
      exp,
      "x-ably-clientId": userId,
      capability: JSON.stringify(capability),
    };

    const token = jwt.sign(tokenPayload, keySecret, {
      algorithm: "HS256",
      header: {
        typ: "JWT",
        alg: "HS256",
        kid: keyName,
      },
    });

    return token;
  } catch (err) {
    console.error("Failed to generate Ably JWT token:", err.message);
    return null;
  }
}

module.exports = room;
