require('dotenv').config();
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwtConfig');

const generateTokens = (payload) => ({
  accessToken: jwt.sign(payload, process.env.SIGNATURE_ACCESS, { expiresIn: jwtConfig.access.expiresIn }),
  refreshToken: jwt.sign(payload, process.env.SIGNATURE_REFRESH, { expiresIn: jwtConfig.refresh.expiresIn }),
});

module.exports = { generateTokens };
