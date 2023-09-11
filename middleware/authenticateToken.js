const jwt = require('jsonwebtoken');
require('dotenv').config();

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return res.status(401).json({ message: 'Токен отсутствует' });
  }

  jwt.verify(token, process.env.SKEY, (error, user) => {
    if (error) {
      return res.status(403).json({ message: 'Неверный токен' });
    }

    req.user = user;
    next();
  });
}

module.exports = authenticateToken;
