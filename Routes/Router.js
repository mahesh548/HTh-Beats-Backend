const express = require("express");
const router = express(express.Router());

//middlewares
const userMailValidator = require("./Middlewares/userMailValidator");
const otpVerifyMid = require("./Middlewares/otpVeirfyMid");
//controller
const signUp = require("./Controller/signUp");
const otpVerify = require("./Controller/otpVerify");

router.post("/signup", [userMailValidator], signUp);
router.post("/otp", [otpVerifyMid], otpVerify);

module.exports = router;
