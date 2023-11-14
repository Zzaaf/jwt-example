require('dotenv').config();
const jwt = require('jsonwebtoken');
const cookiesConfig = require('../config/cookiesConfig');
const { generateTokens } = require('../utils/authUtils');

// Проверка refresh токена из куки
function verifyRefreshToken(req, res, next) {
  const { refresh } = req.cookies;

  if (!refresh) {
    return res.redirect('/auth');
  }

  try {
    const { user } = jwt.verify(refresh, process.env.SIGNATURE_REFRESH);
    const { accessToken, refreshToken } = generateTokens({ user: { id: user.id, email: user.email, name: user.name } });

    res.locals.user = user;

    // Возвращаем пару токенов в http-only cookie при ответе
    res
      .cookie(cookiesConfig.refresh, refreshToken, { maxAge: cookiesConfig.maxAgeRefresh, httpOnly: true })
      .cookie(cookiesConfig.access, accessToken, { maxAge: cookiesConfig.maxAgeAccess, httpOnly: true });

    next();
  } catch (error) {
    res
      .clearCookie(cookiesConfig.refresh)
      .redirect('/auth');
  }
}

function verifyAccessToken(req, res, next) {
  const { access } = req.cookies;

  try {
    const { user } = jwt.verify(access, process.env.SIGNATURE_ACCESS);
    res.locals.user = user;
    next();
  } catch (error) {
    verifyRefreshToken(req, res, next);
  }
}

module.exports = {
  verifyAccessToken,
  verifyRefreshToken,
};
