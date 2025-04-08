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
      });
      const token = generateToken(user.id, newRoom.expiredAt, roomId);
      const response = {
        title: title,
        admin: user.id,
        clientId: user.id,
        token: token,
        roomId: roomId,
      };

      return res.status(200).json({
        status: true,
        ...response,
      });
    }
  } catch (error) {}
};

//generate short lived token for client
function generateToken(userId, expiry, channelId) {
  try {
    const ABLY_API_KEY = process.env.ABLY_KEY;
    if (!ABLY_API_KEY) throw new Error("ABLY_KEY not set in env");

    const [keyName, keySecret] = ABLY_API_KEY.split(":");
    if (!keyName || !keySecret) throw new Error("Invalid ABLY_KEY format");

    const exp = Math.floor(new Date(expiry).getTime() / 1000);
    if (isNaN(exp)) throw new Error("Invalid expiry date");

    const token = jwt.sign(
      {
        capability: JSON.stringify({
          [channelId]: ["publish", "subscribe", "presence"],
        }),
        clientId: userId,
        exp: exp,
      },
      keySecret,
      {
        algorithm: "HS256",
        issuer: keyName,
      }
    );

    return token;
  } catch (err) {
    console.error("Failed to generate Ably token:", err.message);
    return null;
  }
}

module.exports = room;
