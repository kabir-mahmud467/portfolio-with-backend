const mongoose = require("mongoose");

const socialLinkSchema = new mongoose.Schema(
  {
    platform: { type: String, required: true, trim: true },
    label: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true },
    iconUrl: { type: String, trim: true },
    order: { type: Number, default: 0 },
    visible: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("SocialLink", socialLinkSchema);
