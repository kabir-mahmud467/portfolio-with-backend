const mongoose = require("mongoose");

const mediaSchema = new mongoose.Schema(
  {
    url: String,
    publicId: String
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    currency: { type: String, default: "USD" },
    category: { type: String, required: true, trim: true },
    stock: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    image: mediaSchema
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);

