const mongoose = require("mongoose");

const siteSettingsSchema = new mongoose.Schema(
  {
    siteKey: { type: String, default: "main", unique: true },
    brandTagline: { type: String, default: "Portfolio, writing, products, and resources" },
    heroEyebrow: { type: String, default: "Available for select collaborations" },
    heroTitle: { type: String, default: "Crafting sharp, modern digital experiences." },
    heroDescription: {
      type: String,
      default:
        "I’m Kabir Mahmud. This portfolio brings together my work, ideas, resources, books, shop items, and writing in one polished place with a dark glass aesthetic."
    },
    heroPrimaryCta: { type: String, default: "Explore projects" },
    heroPrimaryCtaUrl: { type: String, default: "/projects" },
    heroSecondaryCta: { type: String, default: "Start a conversation" },
    heroSecondaryCtaUrl: { type: String, default: "/contact" },
    aboutTitle: { type: String, default: "A portfolio shaped around clarity and momentum." },
    aboutStory: {
      type: String,
      default:
        "Kabir Mahmud’s portfolio is built to present work cleanly, publish ideas quickly, and keep everything manageable from a single admin panel."
    },
    aboutApproach: {
      type: String,
      default:
        "The site is designed for a dark visual language, glassy surfaces, and a clear hierarchy so the work stands out."
    },
    profileImage: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("SiteSettings", siteSettingsSchema);
