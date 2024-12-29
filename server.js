const express = require("express");
const Router = require("./Routes/Router");
const connectDb = require("./Database/Connect")();

require("dotenv").config();

//safety tools
const bodyParser = require("body-parser");
const helmet = require("helmet");
const xss = require("xss-clean");
const cookieParser = require("cookie-parser");

const app = express();

//safety middlewares
app.use(cookieParser());
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
