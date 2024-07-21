const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/User');

// Register new user
exports.register = async (req, res) => {
    const { username, password, email } = req.body;
    try {
        // Check if user already exists
        let user = await User.findOne({ username });
        if (user) {
            return res.render('auth/register', { error: 'User already exists' });
        }

        // Create new user
        const newUser = new User({ username, password, email });
        
        // Hash password
        const salt = await bcrypt.genSalt(10);
        newUser.password = await bcrypt.hash(password, salt);

        // Save new user
        await newUser.save();
        res.redirect('/auth/login');
    } catch (err) {
        console.error(err);
        res.render('auth/register', { error: 'Something went wrong' });
    }
};

// Login user
exports.login = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            // Handle authentication failure
            return res.render('auth/login', { error: info.message });
        }
        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            res.redirect('/');
        });
    })(req, res, next);
};

// Logout user
exports.logout = (req, res) => {
    req.logout();
    res.redirect('/auth/login');
};
