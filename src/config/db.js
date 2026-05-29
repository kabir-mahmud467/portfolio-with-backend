const mongoose = require("mongoose");

let cachedConnection = null;

async function connectDB() {
  if (cachedConnection) {
    return cachedConnection;
  }

  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not set");
  }

  mongoose.set("strictQuery", true);
  cachedConnection = await mongoose.connect(process.env.MONGODB_URI);
  return cachedConnection;
}

module.exports = { connectDB };

