'use strict';
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

let User = new mongoose.Schema({
  role: {
    type: String,
    default: 'USER',
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    index: true,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },  
},
 {timestamps: true}, );

User.statics.generateToken =  (user) => {
    const token = jwt.sign({id: user._id}, process.env.SALT);
    return token;
};

User.statics.authenticate = async (res, email, password) => {
    try {
        const user = await User.findOne({email: email.toLowerCase()});
        if (!user) {
            throw errors.InvalidInputError('Wrong email or password');
            // res.status(401).send('Wrong login or pass');
            // return;
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            throw errors.InvalidInputError('Wrong email or password');
            // res.status(401).send('Wrong login or pass');
            // return;
        }
        return user;
    } catch (error) {
        console.log(error);
        throw errors.InvalidInputError('Wrong email or password.');
        // res.status(404).send('smth s went wrong');
    }
};
User = mongoose.model('User', User);
module.exports = User;
