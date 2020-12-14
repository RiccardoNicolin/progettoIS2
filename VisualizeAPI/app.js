const express = require('express');
const app = express();
//const db = require('../DB.js');
const morgan = require('morgan');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', express.static('public'));
app.use(morgan('dev'));

const homeRoutes = require('./api/routes/home');
const seriesRoutes = require('./api/routes/series');
const signupRoutes = require('./api/routes/register');
const loginRoutes = require('./api/routes/login');

app.use('/home', homeRoutes);
app.use('/series', seriesRoutes);
app.use('/signup', signupRoutes);
app.use('/login', loginRoutes);

/* Default 404 handler */
app.use((req, res) => {
    res.status(404);
    res.json({ error: 'Not found' });
});

module.exports = app;