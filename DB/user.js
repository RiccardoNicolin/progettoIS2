var mongoose = require('mongoose');

var schema_votes = mongoose.Schema({
    serie: String,
    vote: Number
});

var User_schema = mongoose.Schema({
    username: String,
    email: String,
    password: String,
    admin: Number,
    votes: [schema_votes]
});

const user =  mongoose.model('user',User_schema);

async function find(propertyName, value)
{
    let data = await user.findOne({
        [propertyName] : value
    });
    return data;
}

function addUser(body, hashedpass, cb)
{
    let newuser = {username: body.username, email: body.email, password: hashedpass, admin: 0};
    new user(newuser).save().then(
        cb()
    );
}

async function addVote(serie, vote, username)
{ 
        await user.updateOne(
           {username: username}, //seleziono la serie con nome == id (ovvero quella che mi serve)
           {$push:  //insersco in fondo all'array
                {votes: //nome del campo array
                    {serie: serie,vote: vote} //oggetto che viene inserito
                }
            }
        ).then();
}

//TODO modifica vote

async function  getAll()
{
    let allUsers =  await user.find();
    return allUsers;
    
}

module.exports.find = find;
module.exports.addUser = addUser;
module.exports.getAll = getAll;
module.exports.user = user;