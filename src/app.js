const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const methodOverride = require("method-override");
const expressLayouts = require("express-ejs-layouts");

const { connectDB } = require("./config/db");
const { configureCloudinary } = require("./config/cloudinary");
const { attachCurrentUser } = require("./middleware/auth");
const { attachSiteSettings } = require("./middleware/siteSettings");
const { flashFromQuery } = require("./middleware/flash");
const { notFound } = require("./middleware/notFound");
const siteRoutes = require("./routes/siteRoutes");
const adminRoutes = require("./routes/adminRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

configureCloudinary();

app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "layouts/main");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "../public")));

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    next(error);
  }
});

app.use(attachCurrentUser);
app.use(attachSiteSettings);
app.use(flashFromQuery);

app.use("/", siteRoutes);
app.use("/", authRoutes);
app.use("/admin", adminRoutes);

app.use(notFound);

app.use((error, req, res, next) => {
  console.error(error);
  const statusCode = error.statusCode || 500;
  res.status(statusCode).render("pages/error", {
    title: "Something went wrong",
    pageClass: "page-error",
    message: error.message || "Internal server error"
  });
});

module.exports = app;
