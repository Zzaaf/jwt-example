const jwt = require('jsonwebtoken');
require('dotenv').config();

function verifyToken(req, res, next) {
  const { uid: token } = req.cookies;

  if (token === null) {
    return res.status(401).json({ message: 'No token' });
  }

  jwt.verify(token, process.env.SECRET_KEY, (error, user) => {
    if (error) {
      return res.status(403).json({ message: 'Invalid token' });
    }

    res.locals.user = user;
    next();
  });
}

module.exports = verifyToken;
