const authenticate = require('../../middleware/authenticate');
const errors = require('../../errors');
const router = require('express').Router();

router.delete('/file/:id',
    authenticate(),
    errors.wrap(async (req, res) => {
        const models = res.app.get('models');
        const fileDelete = await models.File.findOneAndUpdate({_id: req.params.id}, {is_deleted: true});
        if (!fileDelete) throw errors.NotFoundError('File is not deleting');
        res.json(fileDelete);
    })
);

module.exports = router;
