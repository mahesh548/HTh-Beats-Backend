const express = require("express");
const router = express(express.Router());

//controller
const signUp = require("./Controller/signUp");

router.post("/signup", signUp);

module.exports = router;
