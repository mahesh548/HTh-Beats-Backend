const express = require("express");
const router = express(express.Router());

//middlewares
const userMailValidator = require("./Middlewares/userMailValidator");
const otpVerifyMid = require("./Middlewares/otpVeirfyMid");
const auth = require("./Middlewares/authentication");
const loginMid = require("./Middlewares/loginMid");
const googleMid = require("./Middlewares/googleMid");
const googleMidSignup = require("./Middlewares/googleMidSignup");
//controller
const signUp = require("./Controller/signUp");
const otpVerify = require("./Controller/otpVerify");
const userData = require("./Controller/userData");
const login = require("./Controller/login");
const googleLogin = require("./Controller/googleLogin");
const googleSignup = require("./Controller/googleSignup");

//routes
router.post("/signup", [userMailValidator], signUp);
router.post("/otp", [otpVerifyMid], otpVerify);
router.post("/login", [loginMid], login);
router.post("/google-login", [googleMid], googleLogin);
router.post("/google-signup", [googleMid, googleMidSignup], googleSignup);

//secured routes
router.post("/userdata", [auth], userData);

module.exports = router;
