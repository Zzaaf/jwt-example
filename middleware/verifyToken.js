const jwt = require('jsonwebtoken');
require('dotenv').config();

function verifyToken(req, res, next) {
  const { uid: token } = req.cookies;

  if (token === null) {
    return res.status(401).json({ message: 'No token' });
  }

  jwt.verify(token, process.env.SECRET_KEY, (error, payload) => {
    if (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return res.status(400).json({ message: 'Token expired!' });
      } if (error instanceof jwt.JsonWebTokenError) {
        return res.status(400).json({ message: 'Invalid token!' });
      }
    }

    console.log(payload);

    res.locals.user = payload.name;
    next();
  });
}

module.exports = verifyToken;
