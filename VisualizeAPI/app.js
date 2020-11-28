const express = require('express');
const app = express();
//const db = require('../DB.js');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

mongoose.connect(process.env.DB_URL, {useNewUrlParser: true, useUnifiedTopology: true})

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', express.static('public'));

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