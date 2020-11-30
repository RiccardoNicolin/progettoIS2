const express = require('express');
const router = express.Router();
const db = require('../../../DB.js');
const checkAuth = require('../middleware/checkauth');
const jwt = require("jsonwebtoken");

router.get('/', (req, res) =>{
    //get req for home page, visualizes hot and new series for unsubscribed user
    try {
        //trying to look for token, if token is present and is valid also search the users bookmarked/in vision series
        const token = req.headers.authorization.split(" ")[1];
        const verifydec = jwt.verify(token, process.env.JWT_KEY);
        req.verifydec = verifydec;
        next();

    } catch (error){
        //if error businness as usual it's not logged in
            let serieshot = db.lista_serie.cercaPerTag("hot");
            let seriesnew = db.lista_serie.cercaPerTag("new");
            res.status(200).json({
                serieshot,
                seriesnew
                });
        }
            //TODO when merged put series bookmarked/in vision
            let serieshot = db.lista_serie.cercaPerTag("hot");
            let seriesnew = db.lista_serie.cercaPerTag("new");
            res.status(200).json({
                serieshot,
                seriesnew,
                verifydec: verifydec
                });
        

   
});

router.get('/userlist', checkAuth, (req, res) => { 
    //userlist shown
    res.status(200).json(db.lista_utenti.tutti());
});




module.exports = router;
