const errors = require('../../errors');
const router = require('express').Router();
const authenticate = require('../../middleware/authenticate');

router.get('/files',
    authenticate(),
    errors.wrap(async (req, res) => {
        const models = res.app.get('models');
        const files = await models.File.find({owner_id: res.locals.user.id});
        if (!files) throw errors.NotFoundError('files for that user not found')
        res.json(files);
    })
);

module.exports = router;