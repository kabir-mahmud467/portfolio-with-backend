const { uploadBufferToCloudinary } = require("../utils/cloudinaryUpload");
const { makeSlug } = require("../utils/slug");
const { adminEntities, adminEntityMap } = require("../config/adminEntities");
const ContactSettings = require("../models/ContactSettings");
const Message = require("../models/Message");
const Project = require("../models/Project");
const BlogPost = require("../models/BlogPost");
const SocialLink = require("../models/SocialLink");
const Product = require("../models/Product");
const Book = require("../models/Book");
const Resource = require("../models/Resource");
const SiteSettings = require("../models/SiteSettings");

const singletonModels = {
  contact: ContactSettings
};

function getEntityByKey(key) {
  return adminEntityMap[key];
}

function redirectWithMessage(path, messageKey, message) {
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}${messageKey}=${encodeURIComponent(message)}`;
}

async function generateUniqueSlug(Model, baseValue, currentId = null) {
  let slug = makeSlug(baseValue);
  let counter = 1;
  while (true) {
    const query = { slug };
    if (currentId) {
      query._id = { $ne: currentId };
    }
    const existing = await Model.findOne(query).lean();
    if (!existing) break;
    counter += 1;
    slug = `${makeSlug(baseValue)}-${counter}`;
  }
  return slug;
}

function normalizeBodyValue(fieldName, fieldType, body) {
  const raw = body[fieldName];

  if (fieldType === "checkbox") {
    return raw === "on" || raw === "true" || raw === "1";
  }

  if (fieldType === "number") {
    if (raw === "" || raw === undefined || raw === null) return undefined;
    return Number(raw);
  }

  if (fieldName === "technologies" || fieldName === "tags") {
    return String(raw || "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return raw;
}

function prepareFormValues(entity, item) {
  const values = {};
  entity.fields.forEach((field) => {
    if (field.type === "checkbox") {
      values[field.name] = Boolean(item?.[field.name]);
      return;
    }

    if (field.name === "technologies" || field.name === "tags") {
      values[field.name] = Array.isArray(item?.[field.name]) ? item[field.name].join(", ") : "";
      return;
    }

    values[field.name] = item?.[field.name] ?? "";
  });

  return values;
}

async function renderDashboard(req, res, next) {
  try {
    const [projectCount, postCount, socialCount, productCount, bookCount, resourceCount, messageCount] = await Promise.all([
      Project.countDocuments(),
      BlogPost.countDocuments(),
      SocialLink.countDocuments(),
      Product.countDocuments(),
      Book.countDocuments(),
      Resource.countDocuments(),
      Message.countDocuments()
    ]);

    res.render("admin/dashboard", {
      title: "Admin Dashboard",
      pageClass: "page-admin-dashboard",
      adminEntities,
      stats: [
        { label: "Projects", value: projectCount },
        { label: "Posts", value: postCount },
        { label: "Social links", value: socialCount },
        { label: "Products", value: productCount },
        { label: "Books", value: bookCount },
        { label: "Resources", value: resourceCount },
        { label: "Messages", value: messageCount }
      ],
      settingsLinks: [
        { label: "Site settings", href: "/admin/site-settings" },
        { label: "Contact settings", href: "/admin/contact" },
        { label: "Messages inbox", href: "/admin/messages" }
      ]
    });
  } catch (error) {
    next(error);
  }
}

async function renderEntityList(req, res, next) {
  try {
    const entity = getEntityByKey(req.params.entity);
    if (!entity) {
      return res.redirect("/admin?error=Unknown%20section");
    }

    const items = await entity.model.find().sort({ createdAt: -1 }).lean();

    res.render("admin/manage", {
      title: `${entity.label} Management`,
      pageClass: "page-admin-manage",
      entity,
      items
    });
  } catch (error) {
    next(error);
  }
}

async function renderEntityForm(req, res, next) {
  try {
    const entity = getEntityByKey(req.params.entity);
    if (!entity) {
      return res.redirect("/admin?error=Unknown%20section");
    }

    const item = req.params.id ? await entity.model.findById(req.params.id).lean() : null;
    if (req.params.id && !item) {
      return res.redirect(`${entity.basePath}?error=Item%20not%20found`);
    }

    res.render("admin/form", {
      title: `${req.params.id ? "Edit" : "Add"} ${entity.label.slice(0, -1) || entity.label}`,
      pageClass: "page-admin-form",
      entity,
      item,
      values: prepareFormValues(entity, item)
    });
  } catch (error) {
    next(error);
  }
}

async function saveEntity(req, res, next) {
  try {
    const entity = getEntityByKey(req.params.entity);
    if (!entity) {
      return res.redirect("/admin?error=Unknown%20section");
    }

    const isUpdate = Boolean(req.body.id);
    const current = isUpdate ? await entity.model.findById(req.body.id) : null;

    if (isUpdate && !current) {
      return res.redirect(`${entity.basePath}?error=Item%20not%20found`);
    }

    const payload = {};
    entity.fields.forEach((field) => {
      if (field.type === "file") return;
      const value = normalizeBodyValue(field.name, field.type, req.body);
      if (value !== undefined) {
        payload[field.name] = value;
      }
    });

    const slugSource = payload.title || payload.name || payload.label;
    if (slugSource && (entity.titleField === "title" || entity.titleField === "name")) {
      payload.slug = await generateUniqueSlug(entity.model, slugSource, current?._id || null);
    }

    const fileField = entity.fileField;
    const uploaded = req.file ? await uploadBufferToCloudinary(req.file, `kabir-portfolio/${entity.key}`) : null;

    if (uploaded && fileField) {
      payload[fileField] = uploaded;
    }

    if (isUpdate) {
      const merged = current.toObject();

      Object.keys(payload).forEach((key) => {
        merged[key] = payload[key];
      });

      if (fileField && !uploaded && current[fileField]) {
        merged[fileField] = current[fileField];
      }

      if (merged.slug === undefined && current.slug !== undefined) {
        merged.slug = current.slug;
      }

      current.set(merged);
      await current.save();
    } else {
      await entity.model.create(payload);
    }

    return res.redirect(redirectWithMessage(entity.basePath, "success", `${entity.label.slice(0, -1)} saved`));
  } catch (error) {
    next(error);
  }
}

async function deleteEntity(req, res, next) {
  try {
    const entity = getEntityByKey(req.params.entity);
    if (!entity) {
      return res.redirect("/admin?error=Unknown%20section");
    }

    await entity.model.findByIdAndDelete(req.params.id);
    return res.redirect(redirectWithMessage(entity.basePath, "success", `${entity.label.slice(0, -1)} deleted`));
  } catch (error) {
    next(error);
  }
}

async function renderContactSettings(req, res, next) {
  try {
    const settings = await ContactSettings.findOne({ siteKey: "main" }).lean();
    const formValues = settings || {};

    res.render("admin/contact-settings", {
      title: "Contact Settings",
      pageClass: "page-admin-contact",
      settings: formValues
    });
  } catch (error) {
    next(error);
  }
}

async function saveContactSettings(req, res, next) {
  try {
    const payload = {
      headline: req.body.headline,
      description: req.body.description,
      email: req.body.email,
      phone: req.body.phone,
      location: req.body.location,
      formTitle: req.body.formTitle,
      formButton: req.body.formButton,
      successMessage: req.body.successMessage
    };

    await ContactSettings.findOneAndUpdate(
      { siteKey: "main" },
      { $set: { siteKey: "main", ...payload } },
      { upsert: true, new: true, runValidators: true }
    );

    res.redirect("/admin/contact?success=Contact%20settings%20updated");
  } catch (error) {
    next(error);
  }
}

async function renderMessages(req, res, next) {
  try {
    const messages = await Message.find().sort({ createdAt: -1 }).lean();
    res.render("admin/messages", {
      title: "Messages",
      pageClass: "page-admin-messages",
      messages
    });
  } catch (error) {
    next(error);
  }
}

async function markMessageRead(req, res, next) {
  try {
    await Message.findByIdAndUpdate(req.params.id, { status: "read" });
    res.redirect("/admin/messages?success=Message%20marked%20as%20read");
  } catch (error) {
    next(error);
  }
}

async function deleteMessage(req, res, next) {
  try {
    await Message.findByIdAndDelete(req.params.id);
    res.redirect("/admin/messages?success=Message%20deleted");
  } catch (error) {
    next(error);
  }
}

async function renderSiteSettings(req, res, next) {
  try {
    let settings = await SiteSettings.findOne({ siteKey: "main" }).lean();
    if (!settings) {
      settings = await SiteSettings.create({ siteKey: "main" });
      settings = settings.toObject();
    }

    res.render("admin/site-settings", {
      title: "Site Settings",
      pageClass: "page-admin-site-settings",
      settings
    });
  } catch (error) {
    next(error);
  }
}

async function saveSiteSettings(req, res, next) {
  try {
    const current = await SiteSettings.findOne({ siteKey: "main" });
    const uploaded = req.file ? await uploadBufferToCloudinary(req.file, "kabir-portfolio/site") : null;

    const payload = {
      siteKey: "main",
      brandTagline: req.body.brandTagline,
      heroEyebrow: req.body.heroEyebrow,
      heroTitle: req.body.heroTitle,
      heroDescription: req.body.heroDescription,
      heroPrimaryCta: req.body.heroPrimaryCta,
      heroPrimaryCtaUrl: req.body.heroPrimaryCtaUrl,
      heroSecondaryCta: req.body.heroSecondaryCta,
      heroSecondaryCtaUrl: req.body.heroSecondaryCtaUrl,
      aboutTitle: req.body.aboutTitle,
      aboutStory: req.body.aboutStory,
      aboutApproach: req.body.aboutApproach
    };

    if (uploaded) {
      payload.profileImage = uploaded;
    } else if (current && current.profileImage) {
      payload.profileImage = current.profileImage;
    }

    await SiteSettings.findOneAndUpdate(
      { siteKey: "main" },
      { $set: payload },
      { upsert: true, new: true, runValidators: true }
    );

    res.redirect("/admin/site-settings?success=Site%20settings%20updated");
  } catch (error) {
    next(error);
  }
}

module.exports = {
  renderDashboard,
  renderEntityList,
  renderEntityForm,
  saveEntity,
  deleteEntity,
  renderContactSettings,
  saveContactSettings,
  renderMessages,
  markMessageRead,
  deleteMessage,
  renderSiteSettings,
  saveSiteSettings
};
