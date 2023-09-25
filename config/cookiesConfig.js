const jwtConfig = require('./jwtConfig');

const cookiesConfig = {
  cookieName: 'uid',
  httpOnly: true,
  maxAge: jwtConfig.refresh.expiresIn,
};

module.exports = cookiesConfig;
