const router = require('express').Router();
const authRouter = require('./views/auth.routes');
const profileRouter = require('./views/profile.routes');
const dashboardRouter = require('./views/dashboard.routes');
const authApiRouter = require('./api/auth.api.routes');
const usersApiRouter = require('./api/users.api.routes');
const { rejectIfNotAuthorized } = require('../middleware/auth');

router.use('/', authRouter);
router.use('/profile', profileRouter);
router.use('/dashboard', dashboardRouter);
router.use('/api', authApiRouter);
router.use('/api/users', rejectIfNotAuthorized, usersApiRouter);

module.exports = router;
