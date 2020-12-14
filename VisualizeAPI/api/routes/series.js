const express = require('express');
const router = express.Router();
const serie = require('../../../DB/serie.js');
const userdb = require('../../../DB/user.js');
const checkAuth = require('../middleware/checkauth');
const jwt = require("jsonwebtoken");

router.get('/', async (req, res, next) => {
    // ritorna tutte le serie
    const token = req.headers.authorization.split(" ")[1];
    if (token != "000") {//checking if token passed is dummy token
        try {
            //trying to decode token, if there is respond with decoded
            let allseries = await serie.getAll();
            let token = req.headers.authorization.split(" ")[1];
            const check = jwt.verify(token, process.env.JWT_KEY);
            let verifydec = jwt.verify(token, process.env.JWT_KEY);
            res.status(200).json({
                allseries: allseries,
                verifydec: verifydec
            })

        } catch (error) {//enter here if token is expired/faulty
            let allseries = await serie.getAll();
            res.status(200).json({
                allseries: allseries,
                verifydec: ""
            });
        }
    }
    else {//if token is dummy token enter here
        let allseries = await serie.getAll();
        res.status(200).json({
            allseries: allseries,
            verifydec: ""
        });
    }
});

router.post('/', checkAuth, async (req, res) => {
    //Add new series
    console.log(req.body.verifydec.admin);
    if (req.body.verifydec.admin) {//check if user has admin priviledges
        if (!req.body.name || !req.body.genre || !req.body.actors || !req.body.seasons || !req.body.poster || !req.body.tag) {//checks if basic series data is present
            res.status(500).json({ error: "Not all fields present" });
        }
        else {//enter here if all fields are present
            await serie.addSerie(req.body);
            res.status(201).json({ message: 'Series added' });
        }
    }
    else {
        res.status(401).json({//enter here if admin check failed
            message: "Lacking administration privileges to do this action"
        });
    }
});

router.get('/:name', async (req, res, next) => {
    //get series info specifying by series name
    const id = req.params.name; //name of serie
    const token = req.headers.authorization.split(" ")[1];
    if (token != "000") {//check if token is dummy token
        try {
            //trying to decode the token, checking if the user has already voted on the serie, checking if the serie was "followed" (if there is a watch)
            const token = req.headers.authorization.split(" ")[1];
            const check = jwt.verify(token, process.env.JWT_KEY);
            let selected = await serie.get(id);
            if (selected) {
                let token = req.headers.authorization.split(" ")[1];
                let verifydec = jwt.verify(token, process.env.JWT_KEY);
                console.log(verifydec);
                let v = await userdb.checkIfVote(id, verifydec.username);
                verifydec.voted = v;
                let watched = await userdb.findIfWatched(id, verifydec.username);
                let numepisodes = await serie.countEpisodes(id);
                console.log(verifydec);
                res.status(200).json({
                    selected: selected,
                    verifydec: verifydec,
                    watched: watched,
                    numepisodes: numepisodes
                });
            }
        }catch (error) {//enter here if token is expired/faulty
            let selected = await serie.get(id);
            if (selected) {
                res.status(200).json({
                    selected: selected,
                    verifydec: ""
                });
            }
            else
            {
                res.status(404).json({message: "serie not found"});//ID didn't match any series
            }
        }
    }else {//enter here if token was dummy
        let selected = await serie.get(id);
        if (selected) {
            res.status(200).json({
                selected: selected,
                verifydec: ""
            });
        }
        else
        {
            res.status(404).json({message: "serie not found"});//ID didn't match any series
        }
    }
    });

router.post('/:name', checkAuth, async (req, res) => {
    //either post a comment, "follow" (start watching) the series or add an episode to this serie (if you are an admin)
    let id = req.params.name; //la serie 
    let poster = req.body.verifydec.username; //chi ha postato il commento
    let comment = req.body.comment; //il testo del commento
    let watchednum = req.body.watchednum;//watchednum should always be 1 here, since it's the series main page, should only be passed if wanting to watch
    if(!req.body.episodeName && !req.body.episodeNumber){//check if you want to add an episode, jump to 133 if you want to add episode
        if ((!poster || !comment) && (!watchednum)) {//check if I at least have poster and comment or watched
            res.status(500).json({ message: "Missing parameters" });
        }
        else {
            if (!watchednum){//check if I have poster&comment
                //enter add comment
                await serie.addComment(id, poster, comment);//adding comment
                res.status(201).json({ message: "Comment Stored" });
            }
            else{
                watchedres = await userdb.addWatched(id, req.body.verifydec.username, watchednum);//adding watch
                res.status(201).json({
                    message: "Watched added!",
                    watchedres: watchedres //codice 0/1/2 a seconda di che operazione è avvenuta (0 nuova aggiunta, 1 modificata, 2 fatto niente), lo mando che forse può servire
                })
            }
        }
    }
    else{
        if (req.body.verifydec.admin) {//check if token passed has admin property
            if (!req.body.episodeNumber || !req.body.episodeName) {//checking again if I have both parameters
                res.status(500).json({ error: "Not all fields present" });
            }
            else {
                let success = await serie.addEpisode(id, req.body.episodeNumber, req.body.episodeName);//adding episode
                if (success){//checking if there was an error in addepisode (episode number already existing)
                    res.status(201).json({ message: 'Episode added' });
                }
                else {res.status(403).json({message: 'Episode number already existing retry'})}
            }
        }
        else {//token passed is not admin
            res.status(401).json({
                message: "Lacking administration privileges to do this action"
            });
        }
    }
});

router.patch('/:name', checkAuth, async (req, res, next) => {
    //Either change serie's vote or patch something about the serie
    let id = req.params.name; //the series name (example "Firefly")
    if (!req.body.score) {//checking if score not present, then means the call is patching info
        if (req.body.verifydec.admin) {//checking if token is admin
            if (!req.body.target || !req.body.change)//checking if both parameters needed to change are present
            {
                res.status(500).json({ message: 'Missing target parameters' });
            }
            else {
                if(req.body.target == 'genre' || req.body.target == 'tag' || req.body.target == 'actors'){//checking if the target is an array parameter, if so I have to cut string
                    let changearray = req.body.change.split(',');
                    await serie.modify(id, req.body.target, changearray);
                    res.status(200).json({ message: 'Category successfuly updated' });
                }
                else{//target is not array
                    await serie.modify(id, req.body.target, req.body.change);
                    res.status(200).json({ message: 'Category successfuly updated' });
                }
                
            }
        }
        else {//token is not admin
            res.status(401).json({
                message: "Lacking administration privileges to do this action"
            });
        }
    }
    else {//modifying vote of series, either by adding a new one or changing an existing one
        let oldvote = await userdb.checkIfVote(id, req.body.verifydec.username);
        if (oldvote !== 0) {//checking if user already voted this serie
            await userdb.updateVote(req.body.verifydec.username, id, req.body.score);//changing recorded vote on user
            await serie.userChangedVote(id, oldvote, req.body.score);//updating vote of serie 
            res.status(200).json({ message: "Vote successfully updated" });
        }
        else {
            await userdb.addVote(id, req.body.score, req.body.verifydec.username);//recording vote to user
            await serie.modifyVote(id, req.body.score);//adding vote to serie
            res.status(200).json({ message: 'Vote successfully recorded' });
        }

    }

});

router.get('/:name/:episodenum', async (req, res, next) => {
    //get for episode
    const idserie = req.params.name;//name of serie
    const idepisode = req.params.episodenum;//ID of episode (number)
    let checknext = +idepisode + 1;//this is the "watchnext" value if the episode was already watched (so I can compare later)
    const token = req.headers.authorization.split(" ")[1];
    if (token != "000") {//checking for dummy token
        try {//trying to decode the token, checking if the episode exists, checking if the user has already voted on the episode, 
            //checking if the episode was already watched, checking if the episode is the last one available, passing info from the serie that the episode is a part of
            const token = req.headers.authorization.split(" ")[1];
            const check = jwt.verify(token, process.env.JWT_KEY);
            let selected = await serie.getEpisode(idserie, idepisode);
            if (selected) {//checking if episode exists
                let token = req.headers.authorization.split(" ")[1];
                let verifydec = jwt.verify(token, process.env.JWT_KEY);
                let idvote = idserie + idepisode; //idvote is the name of the series followed by the episode number (Ex. Firefly2) and is used for user vote storage
                let v = await userdb.checkIfVote(idvote, verifydec.username);//checking if user already voted
                verifydec.voted = v;
                let nextwatch = await userdb.findIfWatched(idserie, verifydec.username);//checking the next episode that the user has to watch
                let watched = 0;
                if (nextwatch > idepisode){//checking if the episode was already watched
                    watched = 1;
                }
                let isnotlast = await serie.getEpisode(idserie, checknext);//checking if this is NOT the last episode
                let rootserie = await serie.get(idserie);//getting the root serie for the episode
                res.status(200).json({
                    selected: selected,
                    verifydec: verifydec,
                    watched: watched,  //returns 0 if it wasn't watched, 1 if it was
                    isnotlast: isnotlast, //returns 0 if its the last episode, returns data of next episode if it exists
                    rootserie: rootserie//passing ALL serie data (for example for /Firefly/1 it would pass Firefly)
                });
            }
            else {
                res.status(404).json({//episode does not exist
                    message: "Episode not existing in DB"
                })
            }
        

        }catch (error) {//if token is invalid/expired go here
            let selected = await serie.getEpisode(idserie,idepisode);
            let isnotlast = await serie.getEpisode(idserie, checknext)
            let rootserie = await serie.get(idserie);
            if (selected) {
                res.status(200).json({
                    selected: selected,
                    verifydec: "",
                    isnotlast: isnotlast,
                    rootserie: rootserie
                });
            }
            else{
                res.status(404).json({//ci entri se token sbagliato E episodio non esiste
                    message: "Episode not found"
                });
            }
        }
    }else {//enter here if dummy token
        let selected = await serie.getEpisode(idserie,idepisode);
        let isnotlast = await serie.getEpisode(idserie, checknext)
        let rootserie = await serie.get(idserie);
        if (selected) {
            res.status(200).json({
                selected: selected,
                verifydec: "",
                isnotlast: isnotlast,
                rootserie: rootserie
            });
        }
        else{
            res.status(404).json({//token == 000 episodio non esiste
                message: "Episode not found"
            });
        }
    }
});

router.post('/:name/:episodenum', checkAuth, async (req, res) => {
    //post comments or watch episode
    let idserie = req.params.name; //la serie 
    let idepisode = req.params.episodenum; //episode number
    let poster = req.body.verifydec.username; //chi ha postato il commento TODO CAMBIA PLIS
    let comment = req.body.comment; //il testo del commento
    let watchednum = +idepisode + 1; //this is the "watchnext" value if the episode was already watched (so I can compare later)
    let watchupdate = req.body.watchupdate;//passed boolean to signify if the user wants to update the watch status or not (0 no, 1 yes)
    if ((!poster || !comment) && (!watchupdate)) {//checking to at least have one or the other
        res.status(500).json({ message: "Missing parameters" });
    }
    else {
        if (!watchupdate){//if not watchupdate then adding comment
            //enter add comment
            await serie.addCommentEpisode(idserie, idepisode, poster, comment);//adding a comment to episode
            res.status(201).json({ message: "Comment Stored" });//entri se mi passi poster E commento
        }
        else{
            watchedres = await userdb.addWatched(idserie, req.body.verifydec.username, watchednum);//updating the watch status
            res.status(201).json({//entri se passi SOLO watched
                message: "Watched added!",
                watchedres: watchedres //codice 0/1/2 a seconda di che operazione è avvenuta, lo mando che forse può servire
            })
        }
    }
});

router.patch('/:name/:episodenum', checkAuth, async (req, res, next) => {
    //Either change episode's vote or patch something about the episode
    let idserie = req.params.name; //the series name (example "Firefly")
    let idepisode = req.params.episodenum;//ID of episode (num)
    if (!req.body.score) {//if not score then go into changing parameters
        if (req.body.verifydec.admin) {//checking if admin
            if (!req.body.target || !req.body.change)//checking if both target and change are present
            {
                res.status(500).json({ message: 'Missing target parameters' });
            }
            else {
                if(req.body.target == 'episodeName' || req.body.target == 'episodeNumber'){//checking if I am changing a valid parameter
                    await serie.modifyEpisode(idserie, idepisode, req.body.target, req.body.change); //changing parameter
                    res.status(200).json({ message: 'Category successfuly updated' });
                }
                else{
                    res.status(422).json({ message: 'The category provided cannot be processed' });//tried to access to an invalid parameter
                }
            }
        }
        else {
            res.status(401).json({//token is not admin
                message: "Lacking administration privileges to do this action"
            })
        }

    }
    else {
        //modifica voto
        let idvote = idserie + idepisode;//ex. Firefly2
        let oldvote = await userdb.checkIfVote(idvote, req.body.verifydec.username);
        if (oldvote !== 0) {//checking if the user has voted in the past
            await userdb.updateVote(req.body.verifydec.username, idvote, req.body.score);//updating the user vote
            await serie.userChangedVoteEpisode(idserie,idepisode, oldvote, req.body.score);//updating the episode vote
            res.status(200).json({ message: "Vote successfully updated" });
        }
        else {
            await userdb.addVote(idvote, req.body.score, req.body.verifydec.username);//recording new user vote
            await serie.modifyVoteEpisode(idserie, idepisode, req.body.score); //adding new vote to episode
            res.status(200).json({ message: 'Vote successfully recorded' });
        }

    }

});


module.exports = router;