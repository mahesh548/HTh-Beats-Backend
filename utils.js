const { v4: uuidv4 } = require("uuid");
const validator = require("validator");
const lang = ["Hindi", "English", "Bhojpuri", "Punjabi"];
const utils = {
  dura: (time) => {
    const now = new Date();
    const old = new Date(time);
    const mili = now - old;
    const sec = Math.floor(mili / 1000);
    const min = Math.floor(sec / 60);
    const hrs = Math.floor(min / 60);
    return { mili, sec, min, hrs };
  },
  generateId: () => {
    return uuidv4();
  },
  sendOtp: async (mail) => {
    const otp = Math.floor(1000 + Math.random() * 9000);
    console.log(`OTP: ${otp} sent to ${mail}`);
    return otp;
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
  dura: (time) => {
    const now = new Date();
    const old = new Date(time);
    const mili = now - old;
    const sec = Math.floor(mili / 1000);
    const min = Math.floor(sec / 60);
    const hrs = Math.floor(min / 60);
    return { mili, sec, min, hrs };
  },
};

module.exports = utils;
