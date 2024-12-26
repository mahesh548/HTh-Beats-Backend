const { v4: uuidv4 } = require("uuid");
const validator = require("validator");
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
    return validator.matches(username, /^[a-zA-Z0-9_.]+$/);
  },
};

module.exports = utils;
