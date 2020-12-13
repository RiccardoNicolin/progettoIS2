var mongoose = require('mongoose');
const seriedb = require('./serie');

var votes_schema = mongoose.Schema({
    serie: String,
    vote: Number
}, { _id: false });

var watching_schema = mongoose.Schema({
    seriename: String,
    nextToWatch: Number
})

var User_schema = mongoose.Schema({
    username: String,
    email: String,
    password: String,
    admin: Number,
    votes: [votes_schema],
    watching: [watching_schema]
});

const user = mongoose.model('user', User_schema);

async function find(propertyName, value) {//Finds specific user with property ("propertyName") equal to value passed ("value")
    let data = await user.findOne({
        [propertyName]: value
    });
    return data;
}

function addUser(body, hashedpass, cb) {//Adds new user to database with data provided ("body" and "hashedpass"). Idk what cb is I am a bit scared of it
    let newuser = { username: body.username, email: body.email, password: hashedpass, admin: 0, subbed:[] };
    new user(newuser).save().then(
        cb()
    );
}

async function findAllWatched(username) { //returns array of first 6 series watched by user ("username") paried with how many episodes were watched
    
    let userfound = await user.findOne({
        username: username
    });
    if (userfound.watching.length == 0) {
        return 0;
    }

    else {
        let listuser = userfound.watching;
        let listserie = [];
        let storageserie;
        let storagenum;
        let storagenumepisodes;
        for (var i=0; i<listuser.length && i<6; i++){
            storageserie = await seriedb.get(listuser[i].seriename);
            storagenum = listuser[i].nextToWatch;
            storagenumepisodes = storageserie.episodes.length()
            listserie.push({serie: storageserie, nextToWatch: storagenum, numepisodes: storagenumepisodes});
        }
        if (listserie == undefined){
            listserie = 0;
        }
        return listserie;
    }
}

async function findIfWatched(serieName, username) { //returns if user ("username") is watching target serie ("serieName") and if so what episode they are on
    
    let userfound = await user.findOne({
        username: username
    });

    if (userfound.watching.length == 0) {
        //no series watched
        return 0;
    }

    else {
        let data = userfound.watching.find(x => x.seriename === serieName);
        if (data !== undefined){
            data = data.nextToWatch;
        }
        else {data = 0; }//serie not found
        return data;//0 not found, any number found and its the episode number
    }

}

async function addWatched(serieName, username, episodenum) { //Checks and adds/updates target user ("username") watching status of target serie/episode ("serieName") depending on the value passed ("episodenum")
    
    let userfound = await user.findOne({
        username: username
    });

    if (userfound.watching.length == 0) {
        //add new
        await user.updateOne(
            { username: username }, //seleziono la serie con nome == id (ovvero quella che mi serve)
            {
                $push:  //insersco in fondo all'array
                {
                    watching: //nome del campo array
                        { seriename: serieName, nextToWatch: episodenum } //oggetto che viene inserito
                }
            }
        ).then();
        return 0; //code/signal for "new added"
    }
    else {
        let data = userfound.watching.find(x => x.seriename === serieName);
        if (data !== undefined){
            if (data.nextToWatch < episodenum){
                //modify existing
            await user.updateOne(
                {
                username: username,
                "watching.seriename": serieName
                },
                { $set: { "watching.$.nextToWatch" : episodenum} }
            )
             return 1; //code/signal for "modified number of nextToWatch"
            }
            
            else{
                return 2;//code/signal for "no change necessary, watched old episode"
            }
        }
        else {
            //add new
            await user.updateOne(
                { username: username }, //seleziono la serie con nome == id (ovvero quella che mi serve)
                {
                    $push:  //insersco in fondo all'array
                    {
                        watching: //nome del campo array
                            { seriename: serieName, nextToWatch: episodenum } //oggetto che viene inserito
                    }
                }
            ).then();
            return 0; //code/signal for "new added"
        }
    }
}

async function addVote(serie, vote, username) {//Adds target serie/episode ("serie") vote ("vote") to user ("username") database of recorded votes
    await user.updateOne(
        { username: username }, //seleziono la serie con nome == id (ovvero quella che mi serve)
        {
            $push:  //insersco in fondo all'array
            {
                votes: //nome del campo array
                    { serie: serie, vote: vote } //oggetto che viene inserito
            }
        }
    ).then();
}

async function checkIfVote(serieName, username) { //Checks if target user ("username") has any recorded vote on target serie/episode ("serieName")
    
    let userfound = await user.findOne({
        username: username
    });
    if (userfound.votes.length == 0) {
        return 0;
    }
    else {
        let data =await  userfound.votes.find(x => x.serie === serieName);
        if (data !== undefined){
            data = data.vote;
        }
        else {data = 0;}
        return data;
    }

}

async function updateVote(username, target, newvalue) {//Updates target user ("username") vote ("newvalue") for provided serie/episode ("target")

    await user.updateOne(
        {
        username: username,
        "votes.serie": target
        },
        { $set: { "votes.$.vote" : newvalue} }
    );
}

async function getAll() {//returns all users saved in database
    let allUsers = await user.find();
    return allUsers;

}


module.exports.find = find;
module.exports.addUser = addUser;
module.exports.getAll = getAll;
module.exports.user = user;
module.exports.addVote = addVote;
module.exports.checkIfVote = checkIfVote;
module.exports.updateVote = updateVote;
module.exports.findAllWatched = findAllWatched;
module.exports.findIfWatched = findIfWatched;
module.exports.addWatched = addWatched;