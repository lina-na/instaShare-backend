const router = require('express').Router();
const errors = require('../../errors');
const bcrypt = require('bcryptjs');

router.post('/signup',
    errors.wrap(async (req, res) => {
        const models = res.app.get('models');
        let userData = req.body;
        userData.password = await bcrypt.hash(req.body.password, 8);
		userData.email = userData.email && userData.email.toLowerCase();
        const user = await models.User.create(userData);
        if (!user) throw errors.NotFoundError('User not created, invalid or missing credentials');
        const token = models.User.generateToken(user);
        user.password = undefined;
        return res.json({
            user: user,
            token: token,
        });
    })
);

module.exports = router;
