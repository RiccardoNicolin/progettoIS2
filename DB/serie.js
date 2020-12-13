var mongoose = require('mongoose');
var Float = require('mongoose-float').loadType(mongoose, 2);

const comment_schema = mongoose.Schema({
    poster: String,
    comment: String
});

var episode_schema = mongoose.Schema({
    episodeName: String,
    episodeNumber: Number,
    score: Float,
    numberOfvotes: Number,
    comments: [comment_schema]
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
    comments: [comment_schema],
    episodes: [episode_schema]
});

const serie = mongoose.model('serie',serie_schema);
const episode = mongoose.model('episode',episode_schema);

async function modifyVote(name, score)//adding new vote ("score") to serie ("name")
{
    let target = await serie.findOne({name: name});
    let old_num =target.numberOfvotes;
    let old_score = target.score;
    let new_num = +old_num+1;
    let new_score = ((old_score * old_num)+ score) / new_num;
    await serie.updateOne({name: name},{score: new_score, numberOfvotes:new_num}).then();
}

async function userChangedVote(name, olds, news)//modifying serie ("name") vote knowing the new user vote ("news") and the old user vote ("olds")
{
    let target = await serie.findOne({name: name});
    let num = target.numberOfvotes
    let tot =  num * target.score;
    let newtot = tot - olds + news
    let new_score = newtot / num;
    await serie.updateOne({name: name},{score: new_score, numberOfvotes: num}).then();
}

async function addSerie(body)//adding new serie specified in "body"
{
    let newSerie = {
        name: body.name,
        poster: body.poster,
        genre: body.genre,
        tag: body.tag,
        score: 0.0,
        numberOfvotes: 0,
        actors: body.actors,
        seasons: body.seasons,
        comments: [],
        episodes: []
        }
        await new serie(newSerie).save();
}

async function  getAll()//getting all series in database
{
    let allSerie = await serie.find();
    return allSerie;
}

async function get(name)//getting specific serie with name "name"
{
    let data= await serie.findOne({name: name})
    return data;
}

async function addComment(name, poster, comment)//Adding a comment ("comment") to specified serie ("name") done by a user ("poster")
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

async function find(propertyName, value)//Find a serie that has property ("propertyName") equal to specified value ("value")
{
    let data = await serie.findOne({
        [propertyName] : value
    });
    return data;    
}

async function modify(name, target, newvalue)//Modify target proporty ("target") to a new value ("newvalue") for target serie ("name")
{
    await serie.updateOne({name: name},{ [target] : newvalue});
}

async function findMore(propertyName, value)//find all series with specified property ("propertyName") of specified value ("value")
{
    let data = await serie.find({
        [propertyName] : value
    });
    return data;  
}

// start of episode functions

async function addEpisode(name, episodenumber, episodename){//Adding new episode of specified name ("episodename") and number ("episodenumber") to target serie ("name") checking if said episode number already exists
    let seriefound = await serie.findOne({//finding target serie
        name: name
    });

    if (seriefound.episodes.length == 0) {//if no episodes exist for it just straight add it since there can be no conflict
        await serie.updateOne(
            {name: name}, 
            {$push:  
                {episodes: 
                    {   episodeName: episodename,
                        episodeNumber: episodenumber,
                        score: 0.0,
                        numberOfvotes: 0,
                        comments: []
                    } 
                }
            }
        )
        return 1;
    }
    
    else {//else check first for conflict
        let data = seriefound.episodes.find(x => x.episodeNumber == episodenumber);
        if (data === undefined){//if I didn't find conflict add otherwise return 0 (error code)
            await serie.updateOne(
                {name: name}, 
                {$push:  
                    {episodes: 
                        {   episodeName: episodename,
                            episodeNumber: episodenumber,
                            score: 0.0,
                            numberOfvotes: 0,
                            comments: []
                        } 
                    }
                }
            )
            return 1;
        } 
        else{
            return 0;
        }
    }
    
        
    }
    
    async function getEpisode(name, episodenum)//Get specific episode number ("episodenum") from target serie ("name")
    {
        let seriefound = await serie.findOne({
            name: name
        });
    
        if(seriefound)
        {
            if (seriefound.episodes.length == 0) {
                //no episodes available 
                return 0;
            }
            else {
                let data =await seriefound.episodes.find(x => x.episodeNumber == episodenum);
    
                if (data === undefined){
                    data = 0; //Episode not found
                }
                return data;//0 not found, whole episode if found
            }
        }
        else
        {
            return 0;
        }
    }
    
    async function countEpisodes(name){//Returns how many episode target serie ("name") has

        let seriefound = await serie.findOne({
            name: name
        });
        
        let numepisodes = seriefound.episodes.length()
        return numepisodes;
    }

    async function addCommentEpisode(name, episodenum, poster, comment)//Add a comment ("comment") made by user ("poster") to a specific episode ("episodenum") of target serie ("name")
    {
            await serie.updateOne(
                {
                    name: name,
                    "episodes.episodeNumber": episodenum
                }, //seleziono la serie con nome == id (ovvero quella che mi serve)
               {$push:  //insersco in fondo all'array
                    {"episodes.$.comments": //nome del campo array 
                            {poster: poster,comment: comment} //oggetto che viene inserito 
                        
                    }
                }
            ).then();
    }
    
    async function userChangedVoteEpisode(name, episodenum, olds, news)//User changed old vote ("olds") to new vote ("news") for target episode number ("episodenum") of serie ("name"), recalculating total and changing it
    {
        let seriefound = await serie.findOne({name: name});
        let data = seriefound.episodes.find(x => x.episodeNumber == episodenum);
        let num = data.numberOfvotes;
        let tot =  num * data.score;
        let newtot = (tot - olds) + news
        let new_score = newtot / num;
        await serie.updateOne({name: name, "episodes.episodeNumber": episodenum},{"episodes.$.score": new_score, "episodes.$.numberOfvotes": num}).then();
    }
    
    async function modifyEpisode(name, episodenum, target, newvalue)//Admin is changing target property ("target") of specified episode ("episodenum") of serie ("name") to new value ("newvalue")
    {
        if(target == "episodeName"){
            await serie.updateOne({name: name, "episodes.episodeNumber": episodenum},{ "episodes.$.episodeName" : newvalue});
        }
        else{
            await serie.updateOne({name: name, "episodes.episodeNumber": episodenum},{ "episodes.$.episodeNumber" : newvalue});
        }
    }
    
    async function modifyVoteEpisode(name, episodenum, score){//User is adding a new vote ("score") to target episode ("episodenum") of serie ("name")
    let seriefound = await serie.findOne({name: name});
    let data = seriefound.episodes.find(x => x.episodeNumber == episodenum);
        let old_num =data.numberOfvotes;
        let old_score = data.score;
        let new_num = +old_num+1;
        let new_score = ((old_score * old_num)+ score) / new_num;
        await serie.updateOne({name: name, "episodes.episodeNumber": episodenum},{"episodes.$.score": new_score, "episodes.$.numberOfvotes": new_num}).then();
    }
    
    // end of episode functions

module.exports.findMore = findMore;
module.exports.modify = modify;
module.exports.find = find;
module.exports.addComment = addComment;
module.exports.get = get;
module.exports.getAll = getAll;
module.exports.addSerie = addSerie;
module.exports.modifyVote = modifyVote;
module.exports.userChangedVote = userChangedVote;
module.exports.userChangedVoteEpisode = userChangedVoteEpisode;
module.exports.addEpisode = addEpisode;
module.exports.getEpisode = getEpisode;
module.exports.addCommentEpisode = addCommentEpisode;
module.exports.modifyEpisode = modifyEpisode;
module.exports.modifyVoteEpisode = modifyVoteEpisode;
module.exports.countEpisodes = countEpisodes;
module.exports.episode = episode;
module.exports.serie = serie;
