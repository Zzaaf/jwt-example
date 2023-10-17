const router = require('express').Router();
const Home = require('../../components/Home');
const Authorization = require('../../components/Authorization');
const Registration = require('../../components/Registration');
const Dashboard = require('../../components/Dashboard');
const { verifyAccessToken } = require('../../middleware/verifyTokens');

router.get('/', (req, res) => {
  res.renderComponent(Home, { title: 'JWT Example: Home' });
});

router.get('/auth', (req, res) => {
  res.renderComponent(Authorization, { title: 'JWT Example: Auth' });
});

router.get('/registration', (req, res) => {
  res.renderComponent(Registration, { title: 'JWT Example: Registration' });
});

router.get('/dashboard', verifyAccessToken, (req, res) => {
  const { user } = res.locals;

  console.log(user, ': views.routes.js');

  if (user) {
    res.renderComponent(Dashboard, { title: 'JWT Example: Dashboard', user });
  } else {
    res.redirect('/auth');
  }
});

module.exports = router;
