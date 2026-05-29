const mongoose = require("mongoose");

const mediaSchema = new mongoose.Schema(
  {
    url: String,
    publicId: String
  },
  { _id: false }
);

const resourceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    detail: { type: String, required: true },
    category: { type: String, required: true, trim: true },
    type: { type: String, required: true, trim: true },
    url: { type: String, trim: true },
    featured: { type: Boolean, default: false },
    image: mediaSchema
  },
  { timestamps: true }
);

module.exports = mongoose.model("Resource", resourceSchema);

