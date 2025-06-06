require("dotenv").config();
const express = require("express");
const Router = require("./Routes/Router");
const connectDb = require("./Database/Connect")();
const cors = require("cors");
const cloudinary = require("cloudinary").v2;

//cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

//cors setting
const frontendUrl = process.env.FURL;
const corsOptions = {
  origin: frontendUrl,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: "*",
  credentials: true,
  exposedHeaders: "session",
};

//safety tools
const bodyParser = require("body-parser");
const helmet = require("helmet");
const xss = require("xss-clean");

const app = express();

//safety middlewares
app.options("*", cors(corsOptions));
app.use(cors(corsOptions));
// app.use(cors({ origin: true, credentials: true }));
app.use(bodyParser.json());
app.use(xss());
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'", "https://accounts.google.com/"],
        scriptSrc: [
          "'self'",
          "https://cdn.jsdelivr.net",
          "https://accounts.google.com/",
        ],
        frameSrc: ["'self'", "https://accounts.google.com/"],
      },
    },
  })
);

//middlewares
app.use(express.json());
app.use(Router);
app.use(express.static("./Public"));

app.listen(8080, () => {
  console.log("server booted...");
});
