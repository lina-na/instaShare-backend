/* eslint-disable no-tabs */
const router = require('express').Router();
const errors = require('../../errors');

router.post(
	'/signin',
	errors.wrap(async (req, res) => {
		const {email, password} = req.body;
		const models = res.app.get('models');
		console.log(models, 'HALLLOOOOO');
		console.log(req.body, 'BODY');
		let user;
		try {
			user = await models.User.authenticate(res, email, password);
		} catch (error) {
			console.log(error, 'error');
			throw errors.InvalidInputError('Wrong email or password');
		}
		if (!user) {
			throw errors.InvalidInputError('Wrong email or password');
		}
		const token = models.User.generateToken(user);
		user.lastLoginDate = new Date();
		delete user.password;
		return res.json({authorization: token, user});
	}),
);

module.exports = router;
