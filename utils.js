const { v4: uuidv4 } = require("uuid");
const validator = require("validator");
const axios = require("axios");
const lang = [
  "hindi",
  "english",
  "punjabi",
  "tamil",
  "telugu",
  "marathi",
  "gujarati",
  "bengali",
  "kannada",
  "bhojpuri",
  "malayalam",
  "urdu",
  "haryanvi",
  "rajasthani",
  "odia",
  "assamese",
];
const utils = {
  dura: (time) => {
    const now = new Date();
    const old = new Date(time);
    const mili = now - old;
    const sec = Math.floor(mili / 1000);
    const min = Math.floor(sec / 60);
    const hrs = Math.floor(min / 60);
    const days = Math.floor(hrs / 24);
    return { mili, sec, min, hrs, days };
  },
  generateId: () => {
    return uuidv4();
  },
  sendOtp: async (mail, username) => {
    const otp = Math.floor(1000 + Math.random() * 9000);
    const apiKey = process.env.BREVO_API_KEY;
    const sender = process.env.SENDER;
    const subject = `Your Code - ${otp}`;
    const otpMessage =
      `Dear ${username},\n\n` +
      `Your code is ${otp}. Use it to access your account.\n\n` +
      `If you didn't request this, simply ignore this message.\n\n` +
      `Yours,\nThe HTh Beats Team`;

    const headers = {
      "Content-Type": "application/json",
      "api-key": apiKey,
    };

    const emailData = {
      sender: { name: "HTh Beats", email: sender },
      to: [{ email: mail }],
      subject: subject,
      textContent: otpMessage,
    };

    try {
      await axios.post("https://api.brevo.com/v3/smtp/email", emailData, {
        headers,
      });
    } catch (error) {
      console.error(
        "Error sending OTP email:",
        error.response ? error.response.data : error.message
      );
    }
    return otp;
  },
  sendMail: async (emails, subject, message) => {
    const apiKey = process.env.BREVO_API_KEY;
    const sender = process.env.SENDER;

    const headers = {
      "Content-Type": "application/json",
      "api-key": apiKey,
    };

    const emailData = {
      sender: { name: "HTh Beats", email: sender },
      to: emails,
      subject: subject,
      textContent: message,
    };

    try {
      await axios.post("https://api.brevo.com/v3/smtp/email", emailData, {
        headers,
      });
    } catch (error) {
      console.error(
        "Error sending bulk email:",
        error.response ? error.response.data : error.message
      );
    }
  },
  isValidUsername: (username) => {
    return validator.matches(username, /^[a-zA-Z0-9_]+$/);
  },
  filterLang: (array) => {
    let newArray = array.filter((item) => lang.includes(item));
    return newArray;
  },

  generateRandomId: (length) => {
    if (length <= 0) return "";

    let result = "";
    for (let i = 0; i < length; i++) {
      result += Math.floor(Math.random() * 10);
    }
    return result;
  },

  isPrivate: (userId, id) => {
    // if playlist has no userId array then not private
    if (!Array.isArray(userId)) return false;

    if (userId.length > 0 && userId.includes(id)) {
      // if userId contain only one id that is user then private and allowed
      return true;
    } else {
      // if userId has more or less than 1 user then not private
      return false;
    }
  },
  isCollab: (userId, id) => {
    // if playlist has no userId then not collab
    if (!Array.isArray(userId)) return false;

    if (
      userId.filter((item) => item != "viewOnly").length > 1 &&
      userId.includes(id)
    ) {
      // if user id contain one or more id and user is one of them then collab and allowed
      return true;
    } else {
      // if userId has less than 1 user then not collab
      return false;
    }
  },

  isDifferentDay: (timestamp1, timestamp2) => {
    const date1 = new Date(timestamp1);
    const date2 = new Date(timestamp2);

    return (
      date1.getFullYear() !== date2.getFullYear() ||
      date1.getMonth() !== date2.getMonth() ||
      date1.getDate() !== date2.getDate()
    );
  },
};

module.exports = utils;
