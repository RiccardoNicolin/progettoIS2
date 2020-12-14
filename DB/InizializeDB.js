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
    subbed: [],
    watching: 
        { seriename: "Breaking Bad", nextToWatch: 7 } //oggetto che viene inserito
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
    comments: [],
    episodes: []
};

var ep1= {
    episodeName: "Serenity",
    episodeNumber: 1,
    score: 0,
    numberOfvotes: 0,
    comments: []
};

var ep2= {
    episodeName: "The Train Job",
    episodeNumber: 2,
    score: 0,
    numberOfvotes: 0,
    comments: []
};

var ep3= {
    episodeName: "Bushwhacked",
    episodeNumber: 3,
    score: 0,
    numberOfvotes: 0,
    comments: []
};

var ep4= {
    episodeName: "Shindig",
    episodeNumber: 4,
    score: 0,
    numberOfvotes: 0,
    comments: []
};

var ep5= {
    episodeName: "Safe",
    episodeNumber: 5,
    score: 0,
    numberOfvotes: 0,
    comments: []
};

var ep6= {
    episodeName: "Our Mrs. Reynolds",
    episodeNumber: 6,
    score: 0,
    numberOfvotes: 0,
    comments: []
};

var ep7= {
    episodeName: "Jaynestown",
    episodeNumber: 7,
    score: 0,
    numberOfvotes: 0,
    comments: []
};

var ep8= {
    episodeName: "Out of Gas",
    episodeNumber: 8,
    score: 0,
    numberOfvotes: 0,
    comments: []
};

var ep9= {
    episodeName: "Ariel",
    episodeNumber: 9,
    score: 0,
    numberOfvotes: 0,
    comments: []
};

var ep10= {
    episodeName: "War Stories",
    episodeNumber: 10,
    score: 0,
    numberOfvotes: 0,
    comments: []
};

var ep11= {
    episodeName: "Trash",
    episodeNumber: 11,
    score: 0,
    numberOfvotes: 0,
    comments: []
};

var ep12= {
    episodeName: "The Message",
    episodeNumber: 12,
    score: 0,
    numberOfvotes: 0,
    comments: []
};

var ep13= {
    episodeName: "Heart of Gold",
    episodeNumber: 13,
    score: 0,
    numberOfvotes: 0,
    comments: []
};

var ep14= {
    episodeName: "Objects in Space",
    episodeNumber: 14,
    score: 0,
    numberOfvotes: 0,
    comments: []
};

Firefly.episodes.push(ep1);
Firefly.episodes.push(ep2);
Firefly.episodes.push(ep3);
Firefly.episodes.push(ep4);
Firefly.episodes.push(ep5);
Firefly.episodes.push(ep6);
Firefly.episodes.push(ep7);
Firefly.episodes.push(ep8);
Firefly.episodes.push(ep9);
Firefly.episodes.push(ep10);
Firefly.episodes.push(ep11);
Firefly.episodes.push(ep12);
Firefly.episodes.push(ep13);
Firefly.episodes.push(ep14);

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
};


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