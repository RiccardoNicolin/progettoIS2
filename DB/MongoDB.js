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

var utente1 = {
    username: "Admin",
        email: "admin@admin",
        password: "admin"
}

var utente2 = {
    username: "Beppe",
    email : "beppe@mail.com",
    password: "canto",
}

bcrypt.hash(utente2.password,10, (err, pass) => utente2.password = pass);
bcrypt.hash(utente1.password,10, (err, pass) => utente1.password = pass);


user.deleteMany().then( () => {
    new user(utente1).save();
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