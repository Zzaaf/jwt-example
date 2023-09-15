require('dotenv').config();
const { randomUUID } = require('crypto');
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwtConfig');
const cookiesConfig = require('../config/cookiesConfig');
const { Token } = require('../db/models');

const generateAccessToken = (userId) => {
  const payload = {
    userId,
    type: jwtConfig.access.type,
  };

  const options = {
    expiresIn: jwtConfig.access.expiresIn,
  };

  return jwt.sign(payload, process.env.SECRET_KEY, options);
};

const generateRefreshToken = () => {
  const payload = {
    tokenId: randomUUID(),
    type: jwtConfig.refresh.type,
  };

  const options = {
    expiresIn: jwtConfig.refresh.expiresIn,
  };

  return {
    id: payload.tokenId,
    token: jwt.sign(payload, process.env.SECRET_KEY, options),
  };
};

const replaceDbRefreshToken = (userId, tokenId) => {
  Token.destroy({ where: { tokenId } })
    .then((deletedToken) => deletedToken && Token.create({ userId, tokenId }))
    .catch((error) => console.log(error.message));
};

const updateTokens = (userId) => {
  const accessToken = generateAccessToken(userId);
  const refreshToken = generateRefreshToken();

  return replaceDbRefreshToken(userId, refreshToken.id)
    .then(() => ({
      accessToken,
      refreshToken: refreshToken.token,
    }));
};

const refreshTokens = (req, res) => {
  const { refreshToken } = req.cookie.uid;

  let payload;

  try {
    payload = jwt.verify(refreshToken, process.env.SECRET_KEY);

    if (payload.type !== 'refresh') {
      return res.status(400).json({ message: 'Invalid token!' });
    }
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(400).json({ message: 'Token expired!' });
    } if (error instanceof jwt.JsonWebTokenError) {
      return res.status(400).json({ message: 'Invalid token!' });
    }
  }

  Token.findOne({ where: { tokenId: payload.id } })
    .then((token) => {
      if (token === null) {
        throw new Error('Invalid token!');
      }

      return updateTokens(token.userId);
    })
    .then((tokens) => res.cookie('uid', tokens, cookiesConfig).json({ login: true, url: '/dashboard' }))
    .catch((error) => res.json({ message: error.message }));
};

module.exports = {
  updateTokens,
  refreshTokens,
};
