const router = require('express').Router();
const authRouter = require('./views/auth.routes');
const profileRouter = require('./views/profile.routes');
const dashboardRouter = require('./views/dashboard.routes');
const apiRouter = require('./api/auth.api.routes');
const tokensRouter = require('./api/tokens.api.routes');
const { verifyAccessToken } = require('../middleware/verifyTokens');

router.use('/', authRouter);
router.use('/profile', verifyAccessToken, profileRouter);
router.use('/dashboard', verifyAccessToken, dashboardRouter);
router.use('/api', apiRouter);
router.use('/api/tokens', tokensRouter);

module.exports = router;
