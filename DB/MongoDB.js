//In questo file popoliamo in maniera standard il DB

var mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
var bcrypt = require('bcrypt');



/*da mettere in app.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

mongoose.connect(process.env.DB_URL, {useNewUrlParser: true, useUnifiedTopology: true})

const user = require('../DB/MongoDB.js');
*/

mongoose.connect(process.env.DB_URL, {useNewUrlParser: true, useUnifiedTopology: true});

var user = require('./user');

//inizializza userlist

var utente2 = {
    username: "Beppe",
    password: "canto",
    email : "beppe@mail.com"
}

//utente2.password = bcrypt.hash(utente2.password, 10);

user.deleteMany().then( () => {
    new user({
        username: "Admin",
        email: "admin@admin",
        password: "admin"
    }).save();
    new user({
        username: "Beppe",
        email: "beppe@mail.com",
        password: "BeppeVince"
    }).save();
    new user(utente2).save();

});



/*
per far funzionare una ricerca

router.get('/userlist', async (req, res) => { 
   
   let prova = await user.findOne({username: /^bepp/});


    res.status(200).json({
        prova
    });
});

*/