const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/User');

exports.register = async (req, res) => {
    const { username, password,email } = req.body;
    try {
        let user = await User.findOne({ username });
        if (user) {
            return res.render('auth/register', { error: 'User already exists' });
        }

        const newUser = new User({ username, password, email });
        const salt = await bcrypt.genSalt(10);
        newUser.password = await bcrypt.hash(password, salt);

        await newUser.save();
        res.redirect('/auth/login');
    } catch (err) {
        console.error(err);
        res.render('auth/register', { error: 'Something went wrong' });
    }
};

exports.login = (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/auth/login',
        failureFlash: true
    })(req, res, next);
};

exports.logout = (req, res) => {
    req.logout();
    res.redirect('/auth/login');
};