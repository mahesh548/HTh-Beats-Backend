const validator = require("validator");
const otpVerifyMid = async (req, res, next) => {
  const { otp, id } = req.body;
  if (!validator.isNumeric(otp) || otp.length != 4)
    return res.status(400).json({ status: false, msg: "invalid otp!" });

  if (!validator.isAlphanumeric(id) || id.length != 10)
    return res.status(400).json({ status: false, msg: "invalid id!" });

  req.body.otp = validator.escape(otp);
  req.body.id = validator.escape(id);
  next();
};
module.exports = otpVerifyMid;
