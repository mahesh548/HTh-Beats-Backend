const express = require("express");
const router = express(express.Router());

//middlewares
const userMailValidator = require("./Middlewares/userMailValidator");
const otpVerifyMid = require("./Middlewares/otpVeirfyMid");
const auth = require("./Middlewares/authentication");
const loginMid = require("./Middlewares/loginMid");
//controller
const signUp = require("./Controller/signUp");
const otpVerify = require("./Controller/otpVerify");
const userData = require("./Controller/userData");
const login = require("./Controller/login");

router.post("/signup", [userMailValidator], signUp);
router.post("/otp", [otpVerifyMid], otpVerify);
router.post("/login", [loginMid], login);

//secured routes
router.post("/userdata", [auth], userData);

module.exports = router;
