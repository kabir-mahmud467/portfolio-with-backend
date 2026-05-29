const mongoose = require("mongoose");

const mediaSchema = new mongoose.Schema(
  {
    url: String,
    publicId: String
  },
  { _id: false }
);

const blogPostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    excerpt: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    tags: [{ type: String, trim: true }],
    published: { type: Boolean, default: true },
    coverImage: mediaSchema
  },
  { timestamps: true }
);

module.exports = mongoose.model("BlogPost", blogPostSchema);

