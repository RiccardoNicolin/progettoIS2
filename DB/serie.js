var mongoose = require('mongoose');
var Float = require('mongoose-float').loadType(mongoose, 2);
const comment_schema = mongoose.Schema({
    poster: String,
    comment: String
});

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
});

const serie = mongoose.model('serie',serie_schema);

async function modifyVote(name, score)
{
    let target = await serie.findOne({name: name});
    //il secondo oggetto rappresenta quello che vine ritornato, in questo caso il primo valore del campo score
    //se _id: 0 non viene inserito, _id iene ritornato di default
    let old_num =target.numberOfvotes;
    let old_score = target.score;
    let new_num = +old_num+1;
    let new_score = ((old_score * old_num)+ score) / new_num;
    await serie.updateOne({name: name},{score: new_score, numberOfvotes:new_num}).then();
}

async function userChangedVote(name, olds, news)
{
    let target = await serie.findOne({name: name});
    //il secondo oggetto rappresenta quello che vine ritornato, in questo caso il primo valore del campo score
    //se _id: 0 non viene inserito, _id iene ritornato di default
    let num = target.numberOfvotes
    let tot =  num * target.score;
    let newtot = tot - olds + news
    let new_score = newtot / num;
    await serie.updateOne({name: name},{score: new_score, numberOfvotes: num}).then();
}

async function addSerie(body)
{
    let newSerie = {
        name: body.nome,
        poster: body.poster,
        genre: body.genere,
        tag: body.tag,
        score: 0.0,
        numberOfvotes: 0,
        actors: body.attori,
        seasons: body.stagioni,
        comments: []
        }
        await new serie(newSerie).save();
}

async function  getAll()
{
    let allSerie = await serie.find();
    return allSerie;
}

async function get(name)
{
    let data= await serie.findOne({name: name})
    return data;
}

async function addComment(name, poster, comment)
{
        await serie.updateOne(
           {name: name}, //seleziono la serie con nome == id (ovvero quella che mi serve)
           {$push:  //insersco in fondo all'array
                {comments: //nome del campo array
                    {poster: poster,comment: comment} //oggetto che viene inserito
                }
            }
        ).then();
}

async function find(propertyName, value)
{
    let data = await serie.findOne({
        [propertyName] : value
    });
    return data;    
}

async function modify(name, target, newvalue)
{
    await serie.updateOne({name: name},{ [target] : newvalue});
}

async function modifyarray(name, target, newvalue)
{
    console.log(target);
    console.log(newvalue);
    console.log(name);
    await serie.updateMany({name: name},{ [target] : newvalue});
}

async function findMore(propertyName, value)
{
    let data = await serie.find({
        [propertyName] : value
    });
    return data;  
}

module.exports.findMore = findMore;
module.exports.modify = modify;
module.exports.find = find;
module.exports.addComment = addComment;
module.exports.get = get;
module.exports.getAll = getAll;
module.exports.addSerie = addSerie;
module.exports.modifyVote = modifyVote;
module.exports.userChangedVote = userChangedVote;
module.exports.serie = serie;
module.exports.modifyarray = modifyarray;
