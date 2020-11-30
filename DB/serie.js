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

export async function modificaVoto(nome, voto)
{
    let target = await serie.findOne({name: id});
    //il secondo oggetto rappresenta quello che vine ritornato, in questo caso il primo valore del campo score
    //se _id: 0 non viene inserito, _id iene ritornato di default
    let old_num =target.numberOfvotes;
    let old_score = target.score;
    let new_num = old_num+1;
    let new_score = ((old_score * old_num)+req.body.vote) / new_num;
    await serie.updateOne({name: id},{score: new_score, numberOfvotes:new_num}).then();
}

export async function addSerie(body)
{
    let newSerie = {
        name: body.nome,
        poster: body.poster,
        genre: body.genere,
        tag: body.tag,
        score: 0,
        numberOfvotes: 0,
        actors: body.attori,
        seasons: body.stagioni,
        comments: []
        }
        await new serie(newSerie).save();
}

export async function  getAll()
{
    let allSerie = await serie.find();
    return allSerie;
}

export async function get(name)
{
    let data= await serie.findOne({name: id})
    return data;
}

export async function addComment(id, poster, comment)
{
    let fullcomment = {poster: poster, comment: comment};
        await serie.updateOne(
           {name: id}, //seleziono la serie con nome == id (ovvero quella che mi serve)
           {$push:  //insersco in fondo all'array
                {comments: //nome del campo array
                    {poster: poster,comment: comment} //oggetto che viene inserito
                }
            }
        ).then();
}

export async function find(propertyName, value)
{
    let data = await serie.findOne({
        [propertyName] : value
    });
    return data;    
}

export async function modify(id, target, newvalue)
{
    await serie.updateOne({name: id},{ [taget] : newvalue});
}

export async function findMore(propertyName, value)
{
    let data = await serie.find({
        [propertyName] : value
    });
    return data;  
}