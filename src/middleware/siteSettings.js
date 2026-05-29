const SiteSettings = require("../models/SiteSettings");

async function attachSiteSettings(req, res, next) {
  try {
    let settings = await SiteSettings.findOne({ siteKey: "main" }).lean();

    if (!settings) {
      const created = await SiteSettings.create({ siteKey: "main" });
      settings = created.toObject();
    }

    res.locals.siteSettings = settings;
    next();
  } catch (error) {
    res.locals.siteSettings = null;
    next(error);
  }
}

module.exports = { attachSiteSettings };
