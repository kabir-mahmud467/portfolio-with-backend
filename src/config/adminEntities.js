const Project = require("../models/Project");
const BlogPost = require("../models/BlogPost");
const SocialLink = require("../models/SocialLink");
const Product = require("../models/Product");
const Book = require("../models/Book");
const Resource = require("../models/Resource");

const adminEntities = [
  {
    key: "projects",
    label: "Projects",
    model: Project,
    basePath: "/admin/projects",
    titleField: "title",
    imageField: "image",
    fileField: "imageFile",
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "excerpt", label: "Short Summary", type: "textarea", required: true },
      { name: "description", label: "Description", type: "textarea", required: true },
      { name: "technologies", label: "Technologies", type: "text", help: "Comma separated" },
      { name: "githubUrl", label: "GitHub URL", type: "url" },
      { name: "liveUrl", label: "Live URL", type: "url" },
      { name: "featured", label: "Featured", type: "checkbox" },
      { name: "imageFile", label: "Project Image", type: "file" }
    ]
  },
  {
    key: "blog",
    label: "Blog Posts",
    model: BlogPost,
    basePath: "/admin/blog",
    titleField: "title",
    imageField: "coverImage",
    fileField: "coverImageFile",
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "excerpt", label: "Excerpt", type: "textarea", required: true },
      { name: "content", label: "Content", type: "textarea", required: true },
      { name: "tags", label: "Tags", type: "text", help: "Comma separated" },
      { name: "published", label: "Published", type: "checkbox" },
      { name: "coverImageFile", label: "Cover Image", type: "file" }
    ]
  },
  {
    key: "socials",
    label: "Social Links",
    model: SocialLink,
    basePath: "/admin/socials",
    titleField: "label",
    fields: [
      { name: "platform", label: "Platform", type: "text", required: true },
      { name: "label", label: "Label", type: "text", required: true },
      { name: "url", label: "URL", type: "url", required: true },
      { name: "iconUrl", label: "Icon URL", type: "url", help: "Optional image URL for the icon" },
      { name: "order", label: "Order", type: "number" },
      { name: "visible", label: "Visible", type: "checkbox" }
    ]
  },
  {
    key: "products",
    label: "Products",
    model: Product,
    basePath: "/admin/products",
    titleField: "name",
    imageField: "image",
    fileField: "imageFile",
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "description", label: "Description", type: "textarea", required: true },
      { name: "price", label: "Price", type: "number", required: true, step: "0.01" },
      { name: "currency", label: "Currency", type: "text", placeholder: "USD" },
      { name: "category", label: "Category", type: "text", required: true },
      { name: "stock", label: "Stock", type: "number" },
      { name: "featured", label: "Featured", type: "checkbox" },
      { name: "imageFile", label: "Product Image", type: "file" }
    ]
  },
  {
    key: "books",
    label: "Books",
    model: Book,
    basePath: "/admin/books",
    titleField: "title",
    imageField: "image",
    fileField: "imageFile",
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "author", label: "Author", type: "text", required: true },
      { name: "description", label: "Description", type: "textarea", required: true },
      { name: "price", label: "Price", type: "number", required: true, step: "0.01" },
      { name: "currency", label: "Currency", type: "text", placeholder: "USD" },
      { name: "category", label: "Category", type: "text", required: true },
      { name: "link", label: "Purchase Link", type: "url" },
      { name: "imageFile", label: "Book Cover", type: "file" }
    ]
  },
  {
    key: "resources",
    label: "Resources",
    model: Resource,
    basePath: "/admin/resources",
    titleField: "title",
    imageField: "image",
    fileField: "imageFile",
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "detail", label: "Details", type: "textarea", required: true },
      { name: "category", label: "Category", type: "text", required: true },
      { name: "type", label: "Type", type: "text", required: true },
      { name: "url", label: "URL", type: "url" },
      { name: "featured", label: "Featured", type: "checkbox" },
      { name: "imageFile", label: "Resource Image", type: "file" }
    ]
  }
];

const adminEntityMap = Object.fromEntries(adminEntities.map((entity) => [entity.key, entity]));

module.exports = { adminEntities, adminEntityMap };
