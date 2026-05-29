const express = require("express");
const multer = require("multer");
const { requireAdmin } = require("../middleware/auth");
const {
  renderDashboard,
  renderEntityList,
  renderEntityForm,
  saveEntity,
  deleteEntity,
  renderSiteSettings,
  saveSiteSettings,
  renderContactSettings,
  saveContactSettings,
  renderMessages,
  markMessageRead,
  deleteMessage
} = require("../controllers/adminController");
const { adminEntities } = require("../config/adminEntities");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.use(requireAdmin);

router.get("/", renderDashboard);
router.get("/site-settings", renderSiteSettings);
router.post("/site-settings", upload.single("profileImageFile"), saveSiteSettings);
router.get("/messages", renderMessages);
router.post("/messages/:id/read", markMessageRead);
router.post("/messages/:id/delete", deleteMessage);
router.get("/contact", renderContactSettings);
router.post("/contact", saveContactSettings);

adminEntities.forEach((entity) => {
  const uploadMiddleware = entity.fileField ? upload.single(entity.fileField) : upload.none();
  const bindEntity = (req, res, next) => {
    req.params.entity = entity.key;
    next();
  };

  router.get(`/${entity.key}`, bindEntity, renderEntityList);
  router.get(`/${entity.key}/new`, bindEntity, renderEntityForm);
  router.get(`/${entity.key}/:id/edit`, bindEntity, renderEntityForm);
  router.post(`/${entity.key}/save`, bindEntity, uploadMiddleware, saveEntity);
  router.post(`/${entity.key}/:id/delete`, bindEntity, deleteEntity);
});

module.exports = router;
