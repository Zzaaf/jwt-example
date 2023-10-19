const router = require('express').Router();
const cookiesConfig = require('../../config/cookiesConfig');
const { generateTokens } = require('../../utils/authUtils');
const { verifyRefreshToken } = require('../../middleware/verifyTokens');

// обработчик для refresh токена, формирует новую пару accessToken и refreshToken
router.get('/refresh', verifyRefreshToken, (req, res) => {
  try {
    const { user } = res.locals;
    const { accessToken, refreshToken } = generateTokens(user);

    // Возвращаем пару токенов в http-only cookie при ответе
    res
      .cookie(cookiesConfig.refresh, refreshToken, { maxAge: cookiesConfig.maxAgeRefresh, httpOnly: true })
      .cookie(cookiesConfig.access, accessToken, { maxAge: cookiesConfig.maxAgeAccess, httpOnly: true })
      .redirect('/dashboard');
  } catch (error) {
    return res.status(400).json({ message: error.message, err: 'handler error for generating a new token pair' });
  }
});

module.exports = router;
