const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect("mongodb://127.0.0.1:27017/short-url").then(() => {
      console.log(`MongoDB connected`);
    });
  } catch (error) {
    console.log("this is db error", error);
    process.exit(1);
  }
};

module.exports = { connectDB };
