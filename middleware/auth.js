const ifAuthRedirect = (url) => (req, res, next) => {
  if (res.locals.user) {
    res.redirect(url);
  } else {
    next();
  }
};

function rejectIfNotAuthorized(req, res, next) {
  if (res.locals.user) {
    next();
  } else {
    res.status(403).json({ message: 'No access' });
  }
}

module.exports = {
  ifAuthRedirect,
  rejectIfNotAuthorized,
};
