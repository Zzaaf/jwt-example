const router = require('express').Router();
const Home = require('../../components/Home');
const Authorization = require('../../components/Authorization');
const Registration = require('../../components/Registration');
const authChecker = require('../../middleware/auth');

router.get('/', authChecker, (req, res) => {
  res.renderComponent(Home, { title: 'JWT Example: Home' });
});

router.get('/auth', authChecker, (req, res) => {
  res.renderComponent(Authorization, { title: 'JWT Example: Auth' });
});

router.get('/registration', authChecker, (req, res) => {
  res.renderComponent(Registration, { title: 'JWT Example: Registration' });
});

module.exports = router;
