const mongoose = require("mongoose");

const usersSchema = mongoose.Schema({
  id: {
    type: String,
    minLength: 10,
    required: true,
  },
  username: { type: String, required: true, minLength: 5, maxLength: 30 },
  email: { type: String, required: true, minLength: 10 },
  createdAt: {
    type: Date,
    default: () => {
      return Date.now();
    },
  },
  otp: { type: Number, min: 1000, max: 9999 },
  verified: { type: Boolean, default: false },
  session: { type: String, default: null },
  pic: { type: String, default: "avtar.png" },
  languages: { type: [String], default: ["Hindi"] },
});

module.exports = mongoose.model("user", usersSchema);
