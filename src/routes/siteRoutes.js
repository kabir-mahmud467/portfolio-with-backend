const express = require("express");
const {
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
} = require("../controllers/siteController");

const router = express.Router();

router.get("/", renderHome);
router.get("/about", renderAbout);
router.get("/projects", renderProjects);
router.get("/projects/:slug", renderProjectDetail);
router.get("/blog", renderBlog);
router.get("/blog/:slug", renderBlogDetail);
router.get("/social", renderSocial);
router.get("/contact", renderContact);
router.post("/contact", submitContact);
router.get("/resources", renderResources);
router.get("/resources/:slug", renderResourceDetail);
router.get("/shop", renderShop);
router.get("/shop/:slug", renderProductDetail);
router.get("/books", renderBooks);
router.get("/books/:slug", renderBookDetail);

module.exports = router;

