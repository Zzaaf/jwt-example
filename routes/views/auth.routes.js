const router = require('express').Router();
const Home = require('../../components/Home');
const Authorization = require('../../components/Authorization');
const Registration = require('../../components/Registration');
const ifAuthRedirect = require('../../middleware/auth');

router.get('/', ifAuthRedirect('/dashboard'), (req, res) => {
  const html = res.renderComponent(Home, { title: 'JWT Example: Home' });
  res.send(html);
});

router.get('/auth', ifAuthRedirect('/dashboard'), (req, res) => {
  const html = res.renderComponent(Authorization, { title: 'JWT Example: Auth' });
  res.send(html);
});

router.get('/registration', ifAuthRedirect('/dashboard'), (req, res) => {
  const html = res.renderComponent(Registration, { title: 'JWT Example: Registration' });
  res.send(html);
});

module.exports = router;
