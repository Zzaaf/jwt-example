const router = require('express').Router();
const mainRouter = require('./views/views.routes');
const apiRouter = require('./api/auth.api.routes');

router.use('/', mainRouter);
router.use('/api', apiRouter);

module.exports = router;
