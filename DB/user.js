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

async function find(propertyName, value) {
    let data = await user.findOne({
        [propertyName]: value
    });
    return data;
}

function addUser(body, hashedpass, cb) {
    let newuser = { username: body.username, email: body.email, password: hashedpass, admin: 0, subbed:[] };
    new user(newuser).save().then(
        cb()
    );
}

//returns array of all series watched by username


async function findAllWatched(username) { 
    
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
        for (var i=0; i<listuser.length && i<6; i++){
            storageserie = await seriedb.get(listuser[i].seriename);
            storagenum = listuser[i].nextToWatch;
            listserie.push({storageserie: storageserie, storagenum: storagenum});
        }
        if (listserie == undefined){
            listserie = 0;
        }
        return listserie;
    }
}
//returns if username is watching serieName and if so what episode they are on
async function findIfWatched(serieName, username) { 
    
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

async function addWatched(serieName, username, episodenum) { 
    
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

async function addVote(serie, vote, username) {
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


async function checkIfVote(serieName, username) { 
    
    let userfound = await user.findOne({
        username: username
    });
    if (userfound.votes.length == 0) {
        return 0;
    }
    else {
        let data = userfound.votes.find(x => x.serie === serieName);
        if (data !== undefined){
            data = data.vote;
        }
        else {data = 0;}
        return data;
    }

}

async function updateVote(username, target, newvalue) {
    //await serie.updateOne({name: name},{ [target] : newvalue});

    

/* if there is a way to re-upload the user here is nicely changed
   let index = userfound.votes.findIndex((x) => x.serie === target);
    console.log(index);
    userfound.votes[index] = {
    serie: target,
    vote: newvalue
};*/

await user.updateOne(
    {
      username: username,
      "votes.serie": target
    },
    { $set: { "votes.$.vote" : newvalue} }
 )
}

async function getAll() {
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