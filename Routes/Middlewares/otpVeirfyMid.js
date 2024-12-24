const validator = require("validator");
const otpVerifyMid = async (req, res, next) => {
  const { otp, id } = req.body;
  if (!validator.isNumeric(otp) || otp.length != 4)
    return res.status(400).json({ status: false, msg: "invalid otp!" });

  const idValid = validator.matches(
    id,
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  );
  if (!idValid)
    return res.status(400).json({ status: false, msg: "invalid id!" });

  req.body.otp = validator.escape(otp);
  req.body.id = validator.escape(id);
  next();
};
module.exports = otpVerifyMid;
