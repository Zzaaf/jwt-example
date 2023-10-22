const router = require('express').Router();
const Profile = require('../../components/Profile');

router.get('/', (req, res) => {
  const { payload: user } = res.locals.user;

  if (user) {
    res.renderComponent(Profile, {
      user,
      title: 'Your Profile',
    });
  } else {
    res.redirect('/auth');
  }
});

module.exports = router;
