require('dotenv').config();
const jwt = require('jsonwebtoken');

function verifyAccessToken(req, res, next) {
  const { access } = req.cookies;

  try {
    const payload = jwt.verify(access, process.env.SIGNATURE_ACCESS);
    res.locals.user = payload;
    next();
  } catch (error) {
    return res.redirect('/api/tokens/refresh');
  }
}

// Проверка refresh токена из куки
function verifyRefreshToken(req, res, next) {
  const { refresh } = req.cookies;

  if (!refresh) {
    return res.redirect('/auth');
  }

  try {
    const { payload } = jwt.verify(refresh, process.env.SIGNATURE_REFRESH);
    res.locals.user = payload;
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
  return next();
}

module.exports = {
  verifyAccessToken,
  verifyRefreshToken,
};
