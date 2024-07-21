// middleware/errorhandler.js
module.exports = function(req, res, next) {
    // Check if there's an authentication error
    if (req.authError) {
        // Pass the error to the template
        res.locals.authError = req.authError;
        // Clear the error after passing it to prevent it from showing on other pages
        req.authError = null;
    }
    next();
};
