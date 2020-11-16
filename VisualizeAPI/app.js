const express = require('express');
const app = express();
const db = require('../DB.js');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', express.static('public'));

const homeRoutes = require('./api/routes/home');
const seriesRoutes = require('./api/routes/series');

app.use('/home', homeRoutes);
app.use('/series', seriesRoutes);

/* Default 404 handler */
app.use((req, res) => {
    res.status(404);
    res.json({ error: 'Not found' });
});

module.exports = app;