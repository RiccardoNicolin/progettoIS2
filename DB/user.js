var mongoose = require('mongoose');

var votes_schema = mongoose.Schema({
    serie: String,
    vote: Number
}, { _id: false });

var User_schema = mongoose.Schema({
    username: String,
    email: String,
    password: String,
    admin: Number,
    votes: [votes_schema],
    subbed: [String]
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
//TODO check if modifica vote funziona
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

//TODO investiga perchè si aggiunge un campo __v allo user, priorità bassa