const router = require('express').Router();
const Edit = require('../../components/Edit');

router.get('/:id', (req, res) => {
  const { id } = req.params;
  const { user } = res.locals;

  if (user) {
    const html = res.renderComponent(Edit, { user, id, title: 'Edit your profile' });
    res.send(html);
  } else {
    res.redirect('/auth');
  }
});

module.exports = router;
