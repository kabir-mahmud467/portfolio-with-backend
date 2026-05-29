const mongoose = require("mongoose");

const mediaSchema = new mongoose.Schema(
  {
    url: String,
    publicId: String
  },
  { _id: false }
);

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    excerpt: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    technologies: [{ type: String, trim: true }],
    githubUrl: { type: String, trim: true },
    liveUrl: { type: String, trim: true },
    featured: { type: Boolean, default: false },
    image: mediaSchema
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);

