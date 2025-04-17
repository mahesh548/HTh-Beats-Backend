const express = require("express");
const router = express(express.Router());
const multer = require("multer");

// 🛡️ Multer config - in memory + validation
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (allowedTypes.includes(file.mimetype)) cb(null, true);
    else cb(null, false);
  },
});

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
const editPlaylist = require("./Controller/editPlaylist.js");
const createPlaylist = require("./Controller/createPlaylist.js");
const joinCollab = require("./Controller/joinCollab.js");
const getActivity = require("./Controller/getActivity.js");
const deleteActivity = require("./Controller/deleteActivity.js");
const songPlayed = require("./Controller/songPlayed.js");
const room = require("./Controller/room.js");
const uploadPic = require("./Controller/uploadPic.js");

//routes
router.post("/signup", [userMailValidator], signUp);
router.post("/verify", [otpVerifyMid], otpVerify);
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
router.post("/edit_playlist", [auth], editPlaylist);
router.post("/collab", [auth], joinCollab);

router.post("/song_played", [auth], songPlayed);
router.get("/activity", [auth], getActivity);
router.delete("/activity", [auth], deleteActivity);

router.post("/room/:event", [auth], room);

router.post("/profile_pic", [upload.single("image"), auth], uploadPic);

module.exports = router;
