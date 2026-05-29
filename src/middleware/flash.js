function flashFromQuery(req, res, next) {
  res.locals.flash = {
    success: req.query.success || "",
    error: req.query.error || ""
  };

  next();
}

module.exports = { flashFromQuery };

