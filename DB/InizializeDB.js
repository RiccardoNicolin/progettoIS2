var bcrypt = require('bcrypt');
var user = require('./user');
var serie = require('./serie');

//inizializza userlist

var utente1 = {
    username: "Admin",
        email: "admin@admin",
        password: "admin",
        admin: 1,
        subbed: []
}
var utente2 = {
    username: "Beppe",
    email : "beppe@mail.com",
    password: "canto",
    admin: 0,
    subbed: []
}

var testuser = {
    username: "testuser",
    email : "testuser@mail.com",
    password: "testuser",
    admin: 1,
    subbed: []
}
//hashing password
bcrypt.hash(utente2.password,10, (err, pass) => utente2.password = pass);
bcrypt.hash(utente1.password,10, (err, pass) => utente1.password = pass);
bcrypt.hash(testuser.password,10, (err, pass) => testuser.password = pass);

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


async function inizializeDB()
{
    await user.user.deleteMany().then(async () => {
        await new user.user(utente1).save();
        await new user.user(utente2).save();
        await new user.user(testuser).save();
    });

    await serie.serie.deleteMany().then(async () => {
        await new serie.serie(Firefly).save();
        await new serie.serie(Brek).save();
    });

}

module.exports.init = inizializeDB;