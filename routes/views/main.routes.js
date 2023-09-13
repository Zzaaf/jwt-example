const router = require('express').Router();
const Home = require('../../components/Home');
const Authorization = require('../../components/Authorization');
const Registration = require('../../components/Registration');
const Dashboard = require('../../components/Dashboard');

router.get('/', (req, res) => {
  res.renderComponent(Home, { title: 'JWT Example: Home' });
});

router.get('/auth', (req, res) => {
  res.renderComponent(Authorization, { title: 'JWT Example: Auth' });
});

router.get('/registration', (req, res) => {
  res.renderComponent(Registration, { title: 'JWT Example: Registration' });
});

router.get('/dashboard', (req, res) => {
  const { user } = res.locals;

  if (user) {
    res.renderComponent(Dashboard, { title: 'Your Dashboard', user });
  } else {
    res.redirect('/auth');
  }

  res.renderComponent(Dashboard, { title: 'JWT Example: Dashboard' });
});

module.exports = router;
