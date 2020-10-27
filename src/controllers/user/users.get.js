const authenticate = require('../../middleware/authenticate');
const errors = require('../../errors');
const router = require('express').Router();

router.get('/user/:id',
    authenticate(),
    errors.wrap(async (req, res) => {
        const models = res.app.get('models');
        const user = await models.User.findById(req.params.id);
        if (!user) throw errors.NotFoundError('user not found');
        res.json(user);
    })
);

module.exports = router;
