const mongoose = require("mongoose");

const contactSettingsSchema = new mongoose.Schema(
  {
    siteKey: { type: String, default: "main", unique: true },
    headline: { type: String, default: "Let’s build something memorable" },
    description: {
      type: String,
      default: "Send a message and I’ll get back to you as soon as possible."
    },
    email: { type: String, default: "hello@example.com" },
    phone: { type: String, default: "+880 0000 000000" },
    location: { type: String, default: "Bangladesh" },
    formTitle: { type: String, default: "Send a message" },
    formButton: { type: String, default: "Submit" },
    successMessage: {
      type: String,
      default: "Thanks for reaching out. I’ll get back to you soon."
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("ContactSettings", contactSettingsSchema);

