require('dotenv').config();
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwtConfig');
const { generateTokens } = require('../utils/authUtils');

// Проверка refresh токена из куки
function verifyRefreshToken(req, res, next) {
  try {
    const { refresh } = req.cookies;
    const { user } = jwt.verify(refresh, process.env.REFRESH_TOKEN_SECRET);
    const { accessToken, refreshToken } = generateTokens({ user: { id: user.id, email: user.email, name: user.name } });

    res.locals.user = user;

    // Возвращаем пару токенов в http-only cookie при ответе
    res
      .cookie(jwtConfig.refresh.type, refreshToken, { maxAge: jwtConfig.refresh.expiresIn, httpOnly: true })
      .cookie(jwtConfig.access.type, accessToken, { maxAge: jwtConfig.access.expiresIn, httpOnly: true });

    next();
  } catch (error) {
    res
      .clearCookie(jwtConfig.refresh.type)
      .clearCookie(jwtConfig.access.type);

    next();
  }
}

function verifyAccessToken(req, res, next) {
  try {
    const { access } = req.cookies;
    const { user } = jwt.verify(access, process.env.ACCESS_TOKEN_SECRET);

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
