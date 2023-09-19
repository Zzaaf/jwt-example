const jwtConfig = {
  access: {
    type: 'access',
    expiresIn: '5m',
  },
  refresh: {
    type: 'refresh',
    expiresIn: '7d',
  },
};

module.exports = jwtConfig;
