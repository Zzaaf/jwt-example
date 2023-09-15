const jwtConfig = {
  access: {
    type: 'access',
    expiresIn: '15m',
  },
  refresh: {
    type: 'access',
    expiresIn: '7d',
  },
};

module.exports = jwtConfig;
