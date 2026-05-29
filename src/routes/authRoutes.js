const express = require("express");
const {
  renderLogin,
  renderSetup,
  handleSetup,
  handleLogin,
  handleLogout
} = require("../controllers/authController");
const { requireAdmin } = require("../middleware/auth");

const router = express.Router();

router.get("/inlog", renderLogin);
router.post("/inlog", handleLogin);
router.get("/login", (req, res) => res.redirect("/inlog"));
router.get("/admin/login", (req, res) => res.redirect("/inlog"));
router.post("/admin/logout", requireAdmin, handleLogout);
router.post("/logout", requireAdmin, handleLogout);
router.get("/setup", renderSetup);
router.post("/setup", handleSetup);

module.exports = router;
