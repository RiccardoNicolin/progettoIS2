var mongoose = require('mongoose');

var User_schema = mongoose.Schema({
    username: String,
    email: String,
    password: String

})

module.exports =  mongoose.model('user',User_schema);