module.exports = {
  ensureAuthenticated: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash("ERROR_MESSAGE", "You are not a Authorized User");
    res.redirect("/auth/login", 302, {});
  },
};
