function notFound(req, res) {
  res.status(404).render("pages/not-found", {
    title: "Page not found",
    pageClass: "page-not-found"
  });
}

module.exports = { notFound };

