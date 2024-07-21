const express = require('express');
const { engine } = require('express-handlebars');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const connectDB = require('./config/db');
const morgan = require('morgan');
require('dotenv').config();
require('./config/passport')(passport);
const flash = require('connect-flash');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');

// Connect to the database
connectDB();

// Set up Handlebars engine with custom helper
const exphbs = require('express-handlebars');
const hbs = exphbs.create({
    extname: '.hbs',
    helpers: {
        eq: function (a, b) {
            return a === b;
        },
        isSelected: function (selected, value) {
            return selected === value ? 'selected' : '';
        }
    }
});
app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');

// Use morgan to log requests
app.use(morgan('dev'));

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Session and Passport middleware
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Static files directory
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Routes
app.use('/auth', require('./routes/auth'));
app.use('/admin', require('./routes/admin'));
app.use('/', require('./routes/material'));

// Default route
app.get('/', (req, res) => res.redirect('/'));

// Middleware to set flash messages
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error'); // For Passport error messages
    next();
});

// Custom error handler
app.use((req, res, next) => {
    if (req.authError) {
        return res.status(401).json({ message: req.authError });
    }
    next();
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('Server running on port ' + PORT));
