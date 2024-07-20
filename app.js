const express = require('express');
const { engine } = require('express-handlebars');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const connectDB = require('./config/db');
require('dotenv').config();
require('./config/passport')(passport);

const app = express();
connectDB();

app.engine('.hbs', engine({ extname: '.hbs' }));
app.set('view engine', '.hbs');

app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', require('./routes/auth'));
app.use('/admin', require('./routes/admin'));
app.use('/materials', require('./routes/material'));

// Serve static files from the uploads directory
app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => res.redirect('/materials'));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('Server running on port '+PORT));