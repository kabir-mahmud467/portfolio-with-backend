const slugify = require("slugify");

function makeSlug(value) {
  return slugify(String(value || "").trim(), {
    lower: true,
    strict: true,
    trim: true
  });
}

module.exports = { makeSlug };

