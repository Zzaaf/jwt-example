const router = require('express').Router();
const cookiesConfig = require('../../config/cookiesConfig');
const { User } = require('../../db/models');
const { verifyAccessToken } = require('../../middleware/verifyTokens');

router.get('/', (req, res) => {
  User.findAll({ raw: true })
    .then((users) => res.json(users));
});

router.route('/:id')
  .put((req, res) => {
    const { id } = req.params;

    if (res.locals.user.id === Number(id)) {
      User.update(req.body, { where: { id }, returning: true })
        .then(() => res.status(200).json({ updated: true, url: '/dashboard' }))
        .catch((error) => res.status(500).json({ error }));
    } else {
      return res.json({ updated: false });
    }
  })
  .delete(verifyAccessToken, (req, res) => {
    const { id } = req.params;

    if (res.locals.user.id === Number(id)) {
      User.destroy({ where: { id } })
        .then((deletedUser) => {
          if (deletedUser) {
            res.locals.user = {};
            return res
              .clearCookie(cookiesConfig.refresh)
              .clearCookie(cookiesConfig.access)
              .json({ delete: true, url: '/' });
          }
          return res.sendStatus(404);
        })
        .catch((error) => res.status(500).json({ error: error.message }));
    } else {
      return res.json({ delete: false });
    }
  });

module.exports = router;
