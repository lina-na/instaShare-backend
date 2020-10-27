const authenticate = require('../../middleware/authenticate');
const errors = require('../../errors');
const router = require('express').Router();

router.delete('/file/:id',
    authenticate(),
    errors.wrap(async (req, res) => {
        const models = res.app.get('models');
        const fileDelete = await models.File.updateOne({id: req.params.id}, {$set: {is_deleted: true}});
        if (!user) throw errors.NotFoundError('user not found');
        res.json(user);
    })
);

module.exports = router;