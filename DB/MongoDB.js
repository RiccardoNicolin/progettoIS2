//In questo file popoliamo in maniera standard il DB

var mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
var bcrypt = require('bcrypt');

mongoose.connect(process.env.DB_URL, {useNewUrlParser: true, useUnifiedTopology: true});

var user = require('./user');
var serie = require('./serie');

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
//hashing password
bcrypt.hash(utente2.password,10, (err, pass) => utente2.password = pass);
bcrypt.hash(utente1.password,10, (err, pass) => utente1.password = pass);

//populate collection users
user.user.deleteMany().then( () => {
    new user.user(utente1).save();
    new user.user(utente2).save();
});

//inizializza serie
var Firefly = {
    name: "Firefly",
    poster: "https://upload.wikimedia.org/wikipedia/it/thumb/a/af/Fireflyopeninglogo.JPG/260px-Fireflyopeninglogo.JPG",
    genre : ["SCI_FI", "Avventura"],
    tag : ["hot", "completed"],
    score: 0.0,
    numberOfvotes: 0.0,
    actors : ["Nathan Fillion"],
    seasons: 1,
    comments: []
}


var Brek = {
    name: "Breaking Bad",
    poster: "https://upload.wikimedia.org/wikipedia/it/b/b8/Breaking_Bad_Pilot_logo.png",
    genre : ["Drammatico", "Thriller"],
    tag : ["new", "completed"],
    score: 0.0,
    numberOfvotes: 0.0,
    actors : ["Bryan Cranston", "Aaron Paul"],
    seasons: 5,
    comments: []
}

//populate collection series
serie.serie.deleteMany().then( () => {
    new serie.serie(Firefly).save();
    new serie.serie(Brek).save();
});

console.log("DB Inizialized");

function inizializeDB()
{
    user.user.deleteMany().then( () => {
        new user.user(utente1).save();
        new user.user(utente2).save();
    });

    serie.serie.deleteMany().then( () => {
        new serie.serie(Firefly).save();
        new serie.serie(Brek).save();
    });

    console.log("DB Inizialized");
}



module.exports.inizializeDB = inizializeDB;