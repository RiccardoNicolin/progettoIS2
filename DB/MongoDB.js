//In questo file popoliamo in maniera standard il DB

var mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const inzialize = require('./InizializeDB');
async function connectAndIinit() {

    await mongoose.connect(process.env.DB_URL_TEST, {useNewUrlParser: true, useUnifiedTopology: true});

    await inzialize.init();

    await mongoose.disconnect();
};

connectAndIinit();