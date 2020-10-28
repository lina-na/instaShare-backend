const authenticate = require('../../middleware/authenticate');
const errors = require('../../errors');
const router = require('express').Router();

router.put('/file',
    authenticate(),
    errors.wrap(async (req, res) => {
        const models = res.app.get('models');
        const {id, fileName} = req.body;
        
        const fileChange = await models.File.findOneAndUpdate({_id: id}, {original_name: fileName});
        if (!fileChange) throw errors.NotFoundError('File is not changing');
        res.json(fileChange);
    })
);

module.exports = router;
