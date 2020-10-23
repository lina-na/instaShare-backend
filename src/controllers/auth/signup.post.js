const router = require('express').Router();
const errors = require('../../errors');
const bcrypt = require('bcryptjs');

router.post('/signup',
    errors.wrap(async (req, res) => {
        const models = res.app.get('models');
        let userData = req.body;
        console.log("body", req.body)
        console.log("password", req.body.password)
        userData.password = await bcrypt.hash(req.body.password, 8);
		userData.email = userData.email && userData.email.toLowerCase();
        const user = await models.User.create(userData);
        console.log("user_signup", user)
        if (!user) throw errors.NotFoundError('User not created, invalid or missing credentials');
        const token = await user.generateToken(user);
        console.log("user_before deleting password", user)
        user.password = undefined;
        console.log("user after deleting password", user)
        return res.json({
            user: user,
            token: token,
        });
    })
);

module.exports = router;
