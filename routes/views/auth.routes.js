const router = require('express').Router();
const Home = require('../../components/Home');
const Authorization = require('../../components/Authorization');
const Registration = require('../../components/Registration');
const ifAuthRedirect = require('../../middleware/auth');

router.get('/', ifAuthRedirect('/dashboard'), (req, res) => {
  res.renderComponent(Home, { title: 'JWT Example: Home' });
});

router.get('/auth', ifAuthRedirect('/dashboard'), (req, res) => {
  res.renderComponent(Authorization, { title: 'JWT Example: Auth' });
});

router.get('/registration', ifAuthRedirect('/dashboard'), (req, res) => {
  res.renderComponent(Registration, { title: 'JWT Example: Registration' });
});

module.exports = router;
