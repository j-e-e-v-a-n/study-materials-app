const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../models/User');

module.exports = function(passport) {
    passport.use(new LocalStrategy({ passReqToCallback: true }, async (req, username, password, done) => {
        try {
            const user = await User.findOne({ username });
            if (!user) {
                req.authError = 'Incorrect username';
                return done(null, false, { message: req.authError });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                req.authError = 'Incorrect password';
                return done(null, false, { message: req.authError });
            }

            return done(null, user);
        } catch (err) {
            return done(err);
        }
    }));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (err) {
            done(err);
        }
    });
};
