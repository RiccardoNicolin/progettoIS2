var mongoose = require('mongoose');

var User_schema = mongoose.Schema({
    username: String,
    email: String,
    password: String

});

const user =  mongoose.model('user',User_schema);

export async function find(propertyName, value)
{
    let data = await serie.findOne({
        [propertyName] : value
    });
    return data;
}

export function addUser(body, hashedpass, cb)
{
    let newuser = {username: body.username, email: body.email, password: hashedpass};
    new user(newuser).save().then(
        cb()
    );
}

export async function  getAll()
{
    let allUsers =  await user.find();
    return allUsers;
    
}