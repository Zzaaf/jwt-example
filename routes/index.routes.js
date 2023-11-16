const router = require('express').Router();

// Views
const authViewRouter = require('./views/auth.routes');
const profileViewRouter = require('./views/profile.routes');
const dashboardViewRouter = require('./views/dashboard.routes');
const usersViewRouter = require('./views/users.routes');

// API
const authApiRouter = require('./api/auth.api.routes');
const usersApiRouter = require('./api/users.api.routes');

// Endpoint Protection
const { rejectIfNotAuthorized } = require('../middleware/auth');

router.use('/', authViewRouter);
router.use('/profile', profileViewRouter);
router.use('/dashboard', dashboardViewRouter);
router.use('/users', usersViewRouter);
router.use('/api', authApiRouter);
router.use('/api/users', rejectIfNotAuthorized, usersApiRouter);

module.exports = router;
