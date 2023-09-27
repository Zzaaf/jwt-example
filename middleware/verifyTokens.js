require('dotenv').config();
const jwt = require('jsonwebtoken');

// Общая проверка токена
function verifyToken(req, res, next) {
  const { uid: refreshToken } = req.cookies;

  if (refreshToken === null) {
    return res.status(401).json({ message: 'No token' });
  }

  jwt.verify(refreshToken, process.env.SIGNATURE_REFRESH, (error, payload) => {
    if (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return res.status(401).json({ message: 'Token expired!' });
      } if (error instanceof jwt.JsonWebTokenError) {
        return res.status(401).json({ message: 'Invalid token!' });
      }
    }

    res.locals.user = payload.payload;
    next();
  });
}

// Проверка access токена из HTTP заголовка "Authorization"
function verifyAccessToken(req, res, next) {
  // const accessToken = req.headers.a
}

// Проверка refresh токена из куки
function verifyRefreshToken(req, res, next) {
  const { uid: refreshToken } = req.cookies;

  if (!refreshToken) {
    res.status(401).json({ message: 'No token' });
  }

  try {
    const payload = jwt.verify(refreshToken, process.env.SIGNATURE_REFRESH);
    console.log(payload);
    res.locals.user = payload;
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
  return next();
}

module.exports = {
  verifyToken,
  verifyAccessToken,
  verifyRefreshToken,
};
