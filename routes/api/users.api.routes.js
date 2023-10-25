const router = require('express').Router();
const cookiesConfig = require('../../config/cookiesConfig');
const { User } = require('../../db/models');

router.route('/:id')
  .put((req, res) => {
    const { id } = req.params;

    User.update(req.body, { where: { id }, returning: true })
      .then((updatedUser) => res.status(201).json(updatedUser))
      .catch((error) => res.status(500).json({ error }));
  })
  .delete((req, res) => {
    const { id } = req.params;

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
  });

module.exports = router;
