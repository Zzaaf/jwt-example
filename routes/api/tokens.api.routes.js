const router = require('express').Router();
const cookiesConfig = require('../../config/cookiesConfig');
const { generateTokens } = require('../../utils/authUtils');
const { verifyRefreshToken } = require('../../middleware/verifyTokens');

router.get('/', verifyRefreshToken, (req, res) => {
  const { accessToken, refreshToken } = generateTokens(res.locals.user);

  // Возвращаем токен в cookie при ответе
  res
    .cookie(cookiesConfig.cookieName, refreshToken, cookiesConfig)
    .json({ login: true, url: '/dashboard', accessToken });
});

module.exports = router;
