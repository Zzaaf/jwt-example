const { User } = require('../db/models');

const ifAuthRedirect = (url) => (req, res, next) => {
  if (res.locals.user) {
    res.redirect(url);
  } else {
    next();
  }
};

const rejectIfNotAuthorized = (req, res, next) => {
  if (res.locals.user) {
    next();
  } else {
    res.status(403).json({ message: 'No access' });
  }
};

const checkUser = async (req, res, next) => {
  if (res.locals.user) {
    res.locals.user = await User.findByPk(Number(res.locals.user.id), {
      raw: true,
      attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
    });
  }

  next();
};

module.exports = {
  ifAuthRedirect,
  rejectIfNotAuthorized,
  checkUser,
};
