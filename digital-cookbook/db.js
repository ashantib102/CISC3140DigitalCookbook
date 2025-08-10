const mongoose = require("mongoose");

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error(
      "❌ Missing MONGODB_URI. Check your .env file name/key and location."
    );
    process.exit(1);
  }

  try {
    await mongoose.connect(uri); // modern Mongoose: no need for old options
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
