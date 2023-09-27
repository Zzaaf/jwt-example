const router = require('express').Router();
const mainRouter = require('./views/views.routes');
const apiRouter = require('./api/auth.api.routes');
const tokensRouter = require('./api/tokens.api.routes');

router.use('/', mainRouter);
router.use('/api', apiRouter);
router.use('/api/tokens', tokensRouter);

module.exports = router;
