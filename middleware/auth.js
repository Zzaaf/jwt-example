const authChecker = (req, res, next) => {
  if (req.cookies.refresh) {
    res.redirect('/dashboard');
  } else {
    next();
  }
};

module.exports = authChecker;
