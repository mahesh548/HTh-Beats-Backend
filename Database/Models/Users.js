const mongoose = require("mongoose");
const utils = require("../../utils");
const usersSchema = mongoose.Schema({
  id: {
    type: String,
    maxLength: 10,
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
});

module.exports = mongoose.model("user", usersSchema);
