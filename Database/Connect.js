const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/users");
    console.log("Users database connected...");
  } catch (error) {
    console.log(error.message);
  }
};
module.exports = connectDb;
