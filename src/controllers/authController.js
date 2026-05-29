const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

function redirectWithMessage(path, messageKey, message) {
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}${messageKey}=${encodeURIComponent(message)}`;
}

function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const derivedKey = crypto.scryptSync(String(password || ""), salt, 64).toString("hex");
  return { passwordHash: derivedKey, passwordSalt: salt };
}

function verifyPassword(password, passwordHash, passwordSalt) {
  const candidate = crypto.scryptSync(String(password || ""), passwordSalt, 64);
  const stored = Buffer.from(passwordHash, "hex");
  if (stored.length !== candidate.length) return false;
  return crypto.timingSafeEqual(stored, candidate);
}

async function ensureDefaultAdmin() {
  const adminCount = await User.countDocuments({ role: "admin" });
  if (adminCount > 0) return;

  const adminUsername = String(process.env.ADMIN_USERNAME || "noone").toLowerCase().trim();
  const adminPassword = String(process.env.ADMIN_PASSWORD || "nothing");
  const { passwordHash, passwordSalt } = hashPassword(adminPassword);
  await User.create({
    name: "Kabir Mahmud",
    username: adminUsername,
    passwordHash,
    passwordSalt,
    role: "admin"
  });
}

async function renderLogin(req, res) {
  await ensureDefaultAdmin();
  res.render("admin/login", {
    title: "Admin Login",
    pageClass: "page-admin-auth",
    allowSetup: false
  });
}

async function renderSetup(req, res) {
  const adminCount = await User.countDocuments({ role: "admin" });

  if (adminCount > 0) {
    return res.redirect("/inlog?error=Admin%20setup%20is%20already%20complete");
  }

  res.render("admin/setup", {
    title: "Create Admin",
    pageClass: "page-admin-auth"
  });
}

async function handleSetup(req, res, next) {
  try {
    const adminCount = await User.countDocuments({ role: "admin" });
    if (adminCount > 0) {
      return res.redirect("/inlog?error=Admin%20setup%20is%20already%20complete");
    }

    const { name, username, password } = req.body;
    if (!name || !username || !password) {
      return res.redirect("/admin/setup?error=All%20fields%20are%20required");
    }

    const { passwordHash, passwordSalt } = hashPassword(password);
    await User.create({
      name,
      username: String(username).toLowerCase().trim(),
      passwordHash,
      passwordSalt,
      role: "admin"
    });

    return res.redirect("/inlog?success=Admin%20account%20created");
  } catch (error) {
    next(error);
  }
}

async function handleLogin(req, res, next) {
  try {
    await ensureDefaultAdmin();
    const { username, password } = req.body;
    const user = await User.findOne({ username: String(username || "").toLowerCase().trim() });

    if (!user) {
      return res.redirect("/inlog?error=Invalid%20credentials");
    }

    const ok = verifyPassword(password, user.passwordHash, user.passwordSalt);
    if (!ok || user.role !== "admin") {
      return res.redirect("/inlog?error=Invalid%20credentials");
    }

    const token = jwt.sign(
      { userId: user._id.toString(), role: user.role },
      process.env.JWT_SECRET || "dev-secret",
      { expiresIn: "7d" }
    );

    res.cookie("admin_token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.redirect("/admin?success=Welcome%20back");
  } catch (error) {
    next(error);
  }
}

function handleLogout(req, res) {
  res.clearCookie("admin_token");
  res.redirect("/inlog?success=Logged%20out");
}

module.exports = {
  renderLogin,
  renderSetup,
  handleSetup,
  handleLogin,
  handleLogout,
  ensureDefaultAdmin,
  redirectWithMessage
};
