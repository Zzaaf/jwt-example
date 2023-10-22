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
    const { payload } = jwt.verify(refresh, process.env.SIGNATURE_REFRESH);

    res.locals.user = payload;
    const { accessToken, refreshToken } = generateTokens(payload);

    // Возвращаем пару токенов в http-only cookie при ответе
    res
      .cookie(cookiesConfig.refresh, refreshToken, { maxAge: cookiesConfig.maxAgeRefresh, httpOnly: true })
      .cookie(cookiesConfig.access, accessToken, { maxAge: cookiesConfig.maxAgeAccess, httpOnly: true });

    next();
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
}

function verifyAccessToken(req, res, next) {
  const { access } = req.cookies;

  try {
    const { payload } = jwt.verify(access, process.env.SIGNATURE_ACCESS);
    res.locals.user = payload;
    next();
  } catch (error) {
    verifyRefreshToken(req, res, next);
  }
}

module.exports = {
  verifyAccessToken,
  verifyRefreshToken,
};
