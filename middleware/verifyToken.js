require('dotenv').config();
const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  // временная заглушка, работает напрямую через RT
  const { uid: refreshToken } = req.cookies;

  if (refreshToken === null) {
    return res.status(401).json({ message: 'No token' });
  }

  jwt.verify(refreshToken, process.env.SIGNATURE_REFRESH, (error, payload) => {
    if (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return res.status(400).json({ message: 'Token expired!' });
      } if (error instanceof jwt.JsonWebTokenError) {
        return res.status(400).json({ message: 'Invalid token!' });
      }
    }

    res.locals.user = payload.payload;
    next();
  });
}

module.exports = verifyToken;
