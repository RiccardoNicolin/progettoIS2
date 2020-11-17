const express = require('express');
const app = express();
const db = require('../DB.js');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', express.static('pubblic'));

const homeRoutes = require('./api/routes/home');
const seriesRoutes = require('./api/routes/series');
const signupRoutes = require('./api/routes/register');

app.use('/home', homeRoutes);
app.use('/series', seriesRoutes);
app.use('/signup', signupRoutes);

/* Default 404 handler */
app.use((req, res) => {
    res.status(404);
    res.json({ error: 'Not found' });
});

module.exports = app;