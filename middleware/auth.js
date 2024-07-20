module.exports = {
    ensureAuthenticated: (req, res, next) => {
        if (req.isAuthenticated()) {
            return next();
        }
        res.redirect('/auth/login');
    },
    ensureAdmin: (req, res, next) => {
        if (req.user && req.user.isAdmin) {
            return next();
        }
        res.redirect('/');
    }
};