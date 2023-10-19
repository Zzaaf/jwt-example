require('dotenv').config();
const jwt = require('jsonwebtoken');

function verifyAccessToken(req, res, next) {
  const { access } = req.cookies;

  if (access === null) {
    return res.status(401).json({ message: 'No token' });
  }

  jwt.verify(access, process.env.SIGNATURE_ACCESS, (error, payload) => {
    if (error) {
      if (error instanceof jwt.TokenExpiredError || error instanceof jwt.JsonWebTokenError) {
        return res.redirect('/api/tokens/refresh');
      }
    }

    res.locals.user = payload.payload;
    next();
  });
}

// Проверка refresh токена из куки
function verifyRefreshToken(req, res, next) {
  const { refresh } = req.cookies;

  if (!refresh) {
    return res.redirect('/');
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
