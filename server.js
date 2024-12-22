const express = require("express");
const Router = require("./Routes/Router");
const connectDb = require("./Database/Connect")();
const app = express();

//middlewares
app.use(express.static("./Public"));
app.use(express.json());
app.use(Router);

app.listen(5000, () => {
  console.log("server booted...");
});
