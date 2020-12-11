const express = require('express');
const router = express.Router();
const serie = require('../../../DB/serie.js');
const userdb = require('../../../DB/user.js');
const checkAuth = require('../middleware/checkauth');
const jwt = require("jsonwebtoken");

router.get('/', async (req, res, next) => {
    // ritorna tutte le serie
    //let allSerie = await serie.find()
    const token = req.headers.authorization.split(" ")[1];
    if (token != "000") {
        try {
            //trying to look for token, if there is respond with decoded
            let allseries = await serie.getAll();
            let token = req.headers.authorization.split(" ")[1];
            const check = jwt.verify(token, process.env.JWT_KEY);
            let verifydec = jwt.verify(token, process.env.JWT_KEY);
            res.status(200).json({
                allseries: allseries,
                verifydec: verifydec
            })

        } catch (error) {
            let allseries = await serie.getAll();
            res.status(200).json({
                allseries: allseries,
                verifydec: ""
            });
        }
    }
    else {
        let allseries = await serie.getAll();
        res.status(200).json({
            allseries: allseries,
            verifydec: ""
        });
    }
   /* let token = req.headers.authorization.split(" ")[1];
    let verifydec = jwt.verify(token, process.env.JWT_KEY);
    res.status(200).json({
        allseries: allseries,
        verifydec: verifydec
    })*/
});

router.post('/', checkAuth, async (req, res) => {
    //post req for home page, esempio postare manualmente hot in frontpage
    if (req.body.verifydec.admin) {
        if (!req.body.nome || !req.body.genre || !req.body.actors || !req.body.seasons || !req.body.poster || !req.body.tag) {
            res.status(500).json({ error: "Not all fields present" });
        }
        else {

            //checks if basic series data is present
            await serie.addSerie(req.body);
            res.status(201).json({ message: 'Series added' });
        }
    }
    else {
        res.status(401).json({
            message: "Lacking administration privileges to do this action"
        });
    }
});

router.get('/:name', async (req, res, next) => {
    const id = req.params.name;
    //get series info specifying by username

    const token = req.headers.authorization.split(" ")[1];
    if (token != "000") {
        try {
            //trying to look for token, if there is respond with decoded, also TODO check if vote was casted
            const token = req.headers.authorization.split(" ")[1];
            const check = jwt.verify(token, process.env.JWT_KEY);
            let selected = await serie.get(id);
            if (selected) {
                let token = req.headers.authorization.split(" ")[1];
                let verifydec = jwt.verify(token, process.env.JWT_KEY);
                let v = await userdb.checkIfVote(id, verifydec.username);
                verifydec.voted = v;
                let watched = await userdb.findIfWatched(id, verifydec.username);
                res.status(200).json({
                    selected: selected,
                    verifydec: verifydec,
                    watched: watched
                });
            }
        

        }catch (error) {
            let selected = await serie.get(id);
            if (selected) {
                res.status(200).json({
                    selected: selected,
                    verifydec: ""
                });
            }
        }
    }else {
            let selected = await serie.get(id);
            if (selected) {
                res.status(200).json({
                    selected: selected,
                    verifydec: ""
                });
            }
        }
    });

router.post('/:name', checkAuth, async (req, res) => {
    //post comments
    let id = req.params.name; //la serie 
    //let token = req.headers.authorization.split(" ")[1];
    //let verifydec = jwt.verify(token, process.env.JWT_KEY);
    let poster = req.body.verifydec.username; //chi ha postato il commento
    let comment = req.body.comment; //il testo del commento
    let watchednum = req.body.watchednum;
    if ((!poster || !comment) && (!watchednum)) {
        res.status(500).json({ message: "Missing parameters" });
    }
    else {
        if (!watchednum){
            //enter add comment
            await serie.addComment(id, poster, comment);
            res.status(201).json({ message: "Comment Stored" });
        }
        else{
            watchedres = await userdb.addWatched(id, req.body.verifydec.username, watchednum);
            res.status(201).json({
                message: "Watched added!",
                watchedres: watchedres //codice 0/1/2 a seconda di che operazione è avvenuta, lo mando che forse può servire
            })
        }
    }
});

router.patch('/:name', checkAuth, async (req, res, next) => {
    //Either register a new series vote or patch something about the series
    let id = req.params.name; //the series nome ['Firefly']
    if (!req.body.score) {
        if (req.body.verifydec.admin) {
            if (!req.body.target || !req.body.change)
            {
                res.status(500).json({ message: 'Missing target parameters' });
            }
            else { //DA SISTEMARE!!!!!!!!

                //modifica categoria, funziona testato per mandare attori o generi bisogna mandare più chiamate change con change[0],change[1]... change[x]
                // serie.updateOne({name: id}{$req.body.target : req.body.change}) 


                //COME DEFERENZIARE IL CAMPO DA UPDATARE???????

                /* old code
                db.lista_serie.modificaCategoria(id, req.body.target, req.body.change);
                 */
                if(req.body.target == 'genre' || req.body.target == 'tag' || req.body.target == 'actors'){
                    let changearray = req.body.change.split(',');
                    await serie.modify(id, req.body.target, changearray);
                    res.status(200).json({ message: 'Category successfuly updated' });
                }
                else{
                    await serie.modify(id, req.body.target, req.body.change);
                    res.status(200).json({ message: 'Category successfuly updated' });
                }
                

            }
        }

        else {
            res.status(401).json({
                message: "Lacking administration privileges to do this action"
            })
        }

    }
    else {
        //modifica voto
        let oldvote = await userdb.checkIfVote(id, req.body.verifydec.username);
        if (oldvote !== 0) {
            await userdb.updateVote(req.body.verifydec.username, id, req.body.score);
            await serie.userChangedVote(id, oldvote, req.body.score);
            res.status(200).json({ message: "Vote successfully updated" });
        }
        else {
            await userdb.addVote(id, req.body.score, req.body.verifydec.username);
            await serie.modifyVote(id, req.body.score);
            res.status(200).json({ message: 'Vote successfully recorded' });
        }

    }

});

router.get('/:name/:episodenum', async (req, res, next) => {
    const idserie = req.params.name;
    const idepisode = req.params.episodenum;
    //get series info specifying by username

    const token = req.headers.authorization.split(" ")[1];
    if (token != "000") {
        try {
            //trying to look for token, if there is respond with decoded, also TODO check if vote was casted
            const token = req.headers.authorization.split(" ")[1];
            const check = jwt.verify(token, process.env.JWT_KEY);
            let selected = await serie.getEpisode(idepisode);
            if (selected) {
                let token = req.headers.authorization.split(" ")[1];
                let verifydec = jwt.verify(token, process.env.JWT_KEY);
                let idvote = idserie + idepisode;
                let v = await userdb.checkIfVote(idvote, verifydec.username);
                verifydec.voted = v;
                let nextwatch = await userdb.findIfWatched(idserie, verifydec.username);
                let watched = 0;
                if (nextwatch > idepisode){
                    watched = 1;
                }
                let checknext = +idepisode + 1;
                let isnotlast = await serie.getEpisode(checknext)
                res.status(200).json({
                    selected: selected,
                    verifydec: verifydec,
                    watched: watched,  //returns 0 if it wasn't watched, 1 if it was
                    isnotlast: isnotlast //returns 0 if its the last episode, returns data of next episode if it exists
                });
            }
            else {
                res.status(404).json({
                    message: "Episode not existing in DB"
                })
            }
        

        }catch (error) {
            let selected = await serie.getEpisode(idepisode);
            if (selected) {
                res.status(200).json({
                    selected: selected,
                    verifydec: ""
                });
            }
            else{
                res.status(404).json({
                    message: "Episode not found"
                })
            }
        }
    }else {
        let selected = await serie.getEpisode(idepisode);
        if (selected) {
            res.status(200).json({
                selected: selected,
                verifydec: ""
            });
        }
        else{
            res.status(404).json({
                message: "Episode not found"
            })
        }
        }
});

router.post('/:name/:episodenum', checkAuth, async (req, res) => {
    //post comments or watch episode
    let idserie = req.params.name; //la serie 
    let idepisode = req.params.episodenum; //episode number
    let poster = req.body.verifydec.username; //chi ha postato il commento
    let comment = req.body.comment; //il testo del commento
    let watchednum = +idepisode + 1;
    if ((!poster || !comment) && (!watchednum)) {
        res.status(500).json({ message: "Missing parameters" });
    }
    else {
        if (!watchednum){
            //enter add comment
            await serie.addCommentEpisode(idserie, idepisode, poster, comment);
            res.status(201).json({ message: "Comment Stored" });
        }
        else{
            watchedres = await userdb.addWatched(idserie, req.body.verifydec.username, watchednum);
            res.status(201).json({
                message: "Watched added!",
                watchedres: watchedres //codice 0/1/2 a seconda di che operazione è avvenuta, lo mando che forse può servire
            })
        }
    }
});

//TODO register new episode, patch existing episode, implementa "last episode"
module.exports = router;