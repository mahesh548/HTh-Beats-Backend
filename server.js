const express = require("express");
const Router = require("./Routes/Router");
const connectDb = require("./Database/Connect")();

//safety tools
const bodyParser = require("body-parser");
const helmet = require("helmet");
const xss = require("xss-clean");

const app = express();

//safety middlewares
app.use(bodyParser.json());
app.use(xss());
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "https://cdn.jsdelivr.net"],
      },
    },
  })
);

//middlewares
app.use(express.json());
app.use(Router);
app.use(express.static("./Public"));

app.listen(5000, () => {
  console.log("server booted...");
});
