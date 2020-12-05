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
                res.status(200).json({
                    selected: selected,
                    verifydec: verifydec
                });
            }

        } catch (error) {
            let selected = await serie.get(id);
            if (selected) {
                res.status(200).json({
                    selected: selected,
                    verifydec: ""
                });
            }
        }
    }
    else {
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
    if (!poster || !comment) {
        res.status(500).json({ message: "Missing parameters" });
    }
    else {

        await serie.addComment(id, poster, comment);
        res.status(201).json({ message: "Comment Stored" });
    }
});

router.patch('/:name', checkAuth, async (req, res, next) => {
    //Either register a new series vote or patch something about the series
    let id = req.params.name; //the series nome ['Firefly']
    if (!req.body.score) {
        if (req.body.verifydec.admin) {
            if (!req.body.change) {res.status(500).json({ message: 'Missing change parameters' });}
            else if (!req.body.target)
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
                await serie.modify(id, req.body.target, req.body.change);
                res.status(200).json({ message: 'Category successfuly updated' });

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
        let user = await userdb.checkIfVote(id, req.body.verifydec.username);
        if (user !== undefined) {
            // user.votes. //TODO FINISH
            // await user.modi
            console.log("this should be the vote" +user);
            console.log("am I ending in undefined true?");
            await userdb.updateVote(req.body.verifydec.username, id, req.body.score);
            res.status(200).json({ message: "placement for now" });
        }
        else {
            console.log("this is found user " + user);
            console.log("this is username " + req.body.verifydec.username);
            let test = await userdb.find("username", "Admin");
            console.log("this is data about the user " + test);
            await userdb.addVote(id, req.body.score, req.body.verifydec.username);
            await serie.modifyVote(id, req.body.score);
            res.status(200).json({ message: 'Vote successfully updated' });
        }

    }

});

module.exports = router;