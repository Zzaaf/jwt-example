const ifAuthRedirect = (url) => (req, res, next) => {
  if (req.cookies.refresh) {
    res.redirect(url);
  } else {
    next();
  }
};

module.exports = ifAuthRedirect;
