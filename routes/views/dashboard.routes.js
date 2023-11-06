const router = require('express').Router();
const Dashboard = require('../../components/Dashboard');

router.get('/', (req, res) => {
  const { user } = res.locals;

  if (user) {
    const html = res.renderComponent(Dashboard, { title: 'JWT Example: Dashboard', name: user.name });
    res.send(html);
  } else {
    res.redirect('/auth');
  }
});

module.exports = router;
