const router = require('express').Router();
const Profile = require('../../components/Profile');

router.get('/', (req, res) => {
  const { user } = res.locals;

  if (user) {
    res.renderComponent(Profile, {
      user,
      email: user.email,
      title: 'Your Profile',
    });
  } else {
    res.redirect('/auth');
  }
});

module.exports = router;
