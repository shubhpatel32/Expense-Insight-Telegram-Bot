const mongoose = require("mongoose");

const URI = process.env.MONGODB_URI;

const connectDb = async () => {
  try {
    await mongoose.connect(URI);
    console.log("DB connected successfully");
  } catch (err) {
    console.error("DB connection unsuccessful:", err);
    process.exit(1);
  }
};

module.exports = connectDb;
