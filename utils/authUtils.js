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

const generateTokens = (payload) => ({
  accessToken: jwt.sign({ payload }, process.env.SIGNATURE_ACCESS, { expiresIn: jwtConfig.access.expiresIn }),
  refreshToken: jwt.sign({ payload }, process.env.SIGNATURE_REFRESH, { expiresIn: jwtConfig.refresh.expiresIn }),
});

module.exports = {
  generateAccessToken,
  generateTokens,
};
