var mongoose = require('mongoose');

var User_schema = mongoose.Schema({
    username: String,
    email: String,
    password: String

});

const user =  mongoose.model('user',User_schema);

async function find(propertyName, value)
{
    let data = await serie.findOne({
        [propertyName] : value
    });
    return data;
}

function addUser(body, hashedpass, cb)
{
    let newuser = {username: body.username, email: body.email, password: hashedpass};
    new user(newuser).save().then(
        cb()
    );
}

async function  getAll()
{
    let allUsers =  await user.find();
    return allUsers;
    
}

module.exports.find = find;
module.exports.addUser = addUser;
module.exports.getAll = getAll;
module.exports.user = user;