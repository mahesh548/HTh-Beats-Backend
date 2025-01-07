require("dotenv").config();
const express = require("express");
const Router = require("./Routes/Router");
const connectDb = require("./Database/Connect")();
const cors = require("cors");

//cors setting
const frontendUrl = process.env.FURL;
const corsOptions = {
  origin: frontendUrl,
  credentials: true,
};

//safety tools
const bodyParser = require("body-parser");
const helmet = require("helmet");
const xss = require("xss-clean");
const cookieParser = require("cookie-parser");

const app = express();

//safety middlewares
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(xss());
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: [
          "'self'",
          "https://accounts.google.com/",
          "https://92rrp2s6-5000.inc1.devtunnels.ms/",
        ],
        scriptSrc: [
          "'self'",
          "https://cdn.jsdelivr.net",
          "https://accounts.google.com/",
          "https://92rrp2s6-5000.inc1.devtunnels.ms/",
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
