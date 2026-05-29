const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    subject: { type: String, trim: true },
    message: { type: String, required: true },
    status: { type: String, enum: ["new", "read"], default: "new" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);

