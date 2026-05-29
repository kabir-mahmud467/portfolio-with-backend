const mongoose = require("mongoose");

const mediaSchema = new mongoose.Schema(
  {
    url: String,
    publicId: String
  },
  { _id: false }
);

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    author: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    currency: { type: String, default: "USD" },
    category: { type: String, required: true, trim: true },
    link: { type: String, trim: true },
    image: mediaSchema
  },
  { timestamps: true }
);

module.exports = mongoose.model("Book", bookSchema);

