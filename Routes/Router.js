const express = require("express");
const router = express(express.Router());

//api models
require("../Database/Models/Entity.js");
require("../Database/Models/Artist.js");

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
const addLanguage = require("./Controller/addLanguage");
const logout = require("./Controller/logout");
const save = require("./Controller/save.js");
const getSave = require("./Controller/getSave.js");
const deleteSave = require("./Controller/deleteSave.js");
const createPlaylist = require("./Controller/createPlaylist.js");

//routes
router.post("/signup", [userMailValidator], signUp);
router.post("/otp", [otpVerifyMid], otpVerify);
router.post("/login", [loginMid], login);
router.post("/google-login", [googleMid], googleLogin);
router.post("/google-signup", [googleMid, googleMidSignup], googleSignup);

//secured routes
router.post("/logout", [auth], logout);
router.post("/user_data", [auth], userData);
router.post("/add_language", [auth], addLanguage);

router.post("/save", [auth], save);
router.get("/save", [auth], getSave);
router.delete("/save", [auth], deleteSave);

router.post("/create_playlist", [auth], createPlaylist);

module.exports = router;
