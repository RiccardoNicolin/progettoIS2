var mongoose = require('mongoose');

const comment_schema = mongoose.Schema({
    poster: String,
    comment: String
})

var serie_schema = mongoose.Schema({
    name: String,
    poster: String,
    genre: [String],
    tag: [String],
    score: Number,
    numberOfvotes: Number,
    actors: [String],
    comments: [comment_schema]
})

module.exports =  mongoose.model('serie',serie_schema);