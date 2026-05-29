const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function attachCurrentUser(req, res, next) {
  try {
    const token = req.cookies?.admin_token;

    if (!token || !process.env.JWT_SECRET) {
      res.locals.currentUser = null;
      res.locals.isAdmin = false;
      return next();
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.userId).lean();

    res.locals.currentUser = user || null;
    res.locals.isAdmin = Boolean(user && user.role === "admin");
    req.currentUser = user || null;
    next();
  } catch (error) {
    res.locals.currentUser = null;
    res.locals.isAdmin = false;
    next();
  }
}

function requireAdmin(req, res, next) {
  if (res.locals.isAdmin) {
    return next();
  }

  return res.redirect("/inlog");
}

module.exports = { attachCurrentUser, requireAdmin };
