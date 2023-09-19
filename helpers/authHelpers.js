require('dotenv').config();
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwtConfig');

const generateAccessToken = ({ id, name, email }) => {
  const payload = {
    id,
    name,
    email,
    type: jwtConfig.access.type,
  };

  const options = {
    algorithm: 'HS256',
    expiresIn: jwtConfig.access.expiresIn,
  };

  return jwt.sign(payload, process.env.SECRET_KEY, options);
};

module.exports = {
  generateAccessToken,
};
