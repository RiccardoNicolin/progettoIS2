var mongoose = require('mongoose');
var Float = require('mongoose-float').loadType(mongoose, 2);
const comment_schema = mongoose.Schema({
    poster: String,
    comment: String
})

var serie_schema = mongoose.Schema({
    name: String,
    poster: String,
    genre: [String],
    tag: [String],
    score: Float,
    numberOfvotes: Number,
    actors: [String],
    seasons: Number,
    comments: [comment_schema]
})

module.exports =  mongoose.model('serie',serie_schema);