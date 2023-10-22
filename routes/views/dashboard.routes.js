const router = require('express').Router();
const Dashboard = require('../../components/Dashboard');

router.get('/', (req, res) => {
  const { payload: user } = res.locals.user;

  if (user) {
    res.renderComponent(Dashboard, { title: 'JWT Example: Dashboard', name: user.name });
  } else {
    res.redirect('/auth');
  }
});

module.exports = router;
