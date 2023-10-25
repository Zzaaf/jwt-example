const router = require('express').Router();
const authRouter = require('./views/auth.routes');
const profileRouter = require('./views/profile.routes');
const dashboardRouter = require('./views/dashboard.routes');
const authApiRouter = require('./api/auth.api.routes');
const usersApiRouter = require('./api/users.api.routes');
const { verifyAccessToken } = require('../middleware/verifyTokens');

router.use('/', authRouter);
router.use('/profile', verifyAccessToken, profileRouter);
router.use('/dashboard', verifyAccessToken, dashboardRouter);
router.use('/api', authApiRouter);
router.use('/api/users', usersApiRouter);

module.exports = router;
