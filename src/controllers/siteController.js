const Project = require("../models/Project");
const BlogPost = require("../models/BlogPost");
const SocialLink = require("../models/SocialLink");
const ContactSettings = require("../models/ContactSettings");
const Message = require("../models/Message");
const Product = require("../models/Product");
const Book = require("../models/Book");
const Resource = require("../models/Resource");
const SiteSettings = require("../models/SiteSettings");

const PAGE_LIMIT = 6;

async function getSiteSettings() {
  let settings = await ContactSettings.findOne({ siteKey: "main" }).lean();

  if (!settings) {
    settings = await ContactSettings.create({ siteKey: "main" });
    settings = settings.toObject();
  }

  return settings;
}

function normalizeList(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  return String(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

async function renderHome(req, res, next) {
  try {
    const [projects, blogPosts, socialLinks, products, books, resources, contactSettings, siteSettings] = await Promise.all([
      Project.find().sort({ featured: -1, createdAt: -1 }).limit(3).lean(),
      BlogPost.find({ published: true }).sort({ createdAt: -1 }).limit(3).lean(),
      SocialLink.find({ visible: true }).sort({ order: 1, createdAt: -1 }).lean(),
      Product.find().sort({ featured: -1, createdAt: -1 }).limit(3).lean(),
      Book.find().sort({ createdAt: -1 }).limit(3).lean(),
      Resource.find().sort({ featured: -1, createdAt: -1 }).limit(3).lean(),
      getSiteSettings(),
      SiteSettings.findOne({ siteKey: "main" }).lean()
    ]);

    res.render("pages/home", {
      title: "Kabir Mahmud | Portfolio",
      pageClass: "page-home",
      projects,
      blogPosts,
      socialLinks,
      products,
      books,
      resources,
      settings: contactSettings,
      siteSettings: siteSettings || res.locals.siteSettings || {},
      stats: [
        { label: "Projects", value: await Project.countDocuments() },
        { label: "Articles", value: await BlogPost.countDocuments({ published: true }) },
        { label: "Resources", value: await Resource.countDocuments() },
        { label: "Connections", value: await SocialLink.countDocuments({ visible: true }) }
      ]
    });
  } catch (error) {
    next(error);
  }
}

async function renderAbout(req, res, next) {
  try {
    const [settings, siteSettings, projectCount, postCount] = await Promise.all([
      getSiteSettings(),
      SiteSettings.findOne({ siteKey: "main" }).lean(),
      Project.countDocuments(),
      BlogPost.countDocuments({ published: true })
    ]);

    res.render("pages/about", {
      title: "About Kabir Mahmud",
      pageClass: "page-about",
      settings,
      siteSettings: siteSettings || res.locals.siteSettings || {},
      stats: [
        { label: "Projects delivered", value: projectCount },
        { label: "Published posts", value: postCount },
        { label: "Creative systems", value: "1" }
      ]
    });
  } catch (error) {
    next(error);
  }
}

async function renderProjects(req, res, next) {
  try {
    const [projects, settings] = await Promise.all([
      Project.find().sort({ featured: -1, createdAt: -1 }).lean(),
      getSiteSettings()
    ]);

    res.render("pages/projects", {
      title: "Projects",
      pageClass: "page-projects",
      projects,
      settings
    });
  } catch (error) {
    next(error);
  }
}

async function renderProjectDetail(req, res, next) {
  try {
    const project = await Project.findOne({ slug: req.params.slug }).lean();
    if (!project) return res.redirect("/projects?error=Project%20not%20found");

    res.render("pages/project-detail", {
      title: project.title,
      pageClass: "page-project-detail",
      project
    });
  } catch (error) {
    next(error);
  }
}

async function renderBlog(req, res, next) {
  try {
    const [posts, settings] = await Promise.all([
      BlogPost.find({ published: true }).sort({ createdAt: -1 }).lean(),
      getSiteSettings()
    ]);

    res.render("pages/blog", {
      title: "Blog",
      pageClass: "page-blog",
      posts,
      settings
    });
  } catch (error) {
    next(error);
  }
}

async function renderBlogDetail(req, res, next) {
  try {
    const post = await BlogPost.findOne({ slug: req.params.slug, published: true }).lean();
    if (!post) return res.redirect("/blog?error=Post%20not%20found");

    res.render("pages/blog-detail", {
      title: post.title,
      pageClass: "page-blog-detail",
      post
    });
  } catch (error) {
    next(error);
  }
}

async function renderSocial(req, res, next) {
  try {
    const [links, settings] = await Promise.all([
      SocialLink.find({ visible: true }).sort({ order: 1, createdAt: -1 }).lean(),
      getSiteSettings()
    ]);

    res.render("pages/social", {
      title: "Social Links",
      pageClass: "page-social",
      links,
      settings
    });
  } catch (error) {
    next(error);
  }
}

async function renderContact(req, res, next) {
  try {
    const settings = await getSiteSettings();
    res.render("pages/contact", {
      title: "Contact",
      pageClass: "page-contact",
      settings
    });
  } catch (error) {
    next(error);
  }
}

async function submitContact(req, res, next) {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.redirect("/contact?error=Please%20fill%20in%20the%20required%20fields");
    }

    await Message.create({ name, email, subject, message });
    return res.redirect("/contact?success=Message%20sent%20successfully");
  } catch (error) {
    next(error);
  }
}

async function renderResources(req, res, next) {
  try {
    const resources = await Resource.find().sort({ featured: -1, createdAt: -1 }).lean();
    res.render("pages/resources", {
      title: "Resources",
      pageClass: "page-resources",
      resources
    });
  } catch (error) {
    next(error);
  }
}

async function renderResourceDetail(req, res, next) {
  try {
    const resource = await Resource.findOne({ slug: req.params.slug }).lean();
    if (!resource) return res.redirect("/resources?error=Resource%20not%20found");

    res.render("pages/resource-detail", {
      title: resource.title,
      pageClass: "page-resource-detail",
      resource
    });
  } catch (error) {
    next(error);
  }
}

async function renderShop(req, res, next) {
  try {
    const products = await Product.find().sort({ featured: -1, createdAt: -1 }).lean();
    res.render("pages/shop", {
      title: "Shop",
      pageClass: "page-shop",
      products
    });
  } catch (error) {
    next(error);
  }
}

async function renderProductDetail(req, res, next) {
  try {
    const product = await Product.findOne({ slug: req.params.slug }).lean();
    if (!product) return res.redirect("/shop?error=Product%20not%20found");

    res.render("pages/product-detail", {
      title: product.name,
      pageClass: "page-product-detail",
      product
    });
  } catch (error) {
    next(error);
  }
}

async function renderBooks(req, res, next) {
  try {
    const books = await Book.find().sort({ createdAt: -1 }).lean();
    res.render("pages/books", {
      title: "Books",
      pageClass: "page-books",
      books
    });
  } catch (error) {
    next(error);
  }
}

async function renderBookDetail(req, res, next) {
  try {
    const book = await Book.findOne({ slug: req.params.slug }).lean();
    if (!book) return res.redirect("/books?error=Book%20not%20found");

    res.render("pages/book-detail", {
      title: book.title,
      pageClass: "page-book-detail",
      book
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getSiteSettings,
  normalizeList,
  renderHome,
  renderAbout,
  renderProjects,
  renderProjectDetail,
  renderBlog,
  renderBlogDetail,
  renderSocial,
  renderContact,
  submitContact,
  renderResources,
  renderResourceDetail,
  renderShop,
  renderProductDetail,
  renderBooks,
  renderBookDetail
};
