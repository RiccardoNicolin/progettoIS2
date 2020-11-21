const express = require('express');
const router = express.Router();
const db = require('../../../DB.js');

router.get('/', (req, res) =>{
    //get req for home page

        let serieshot = db.lista_serie.cercaPerTag("hot");
        let seriesnew = db.lista_serie.cercaPerTag("new");
        res.status(200).json({
            serieshot,
            seriesnew
            });
   
});

router.get('/userlist', (req, res) => { 
    res.send(db.lista_utenti.tutti());
});




module.exports = router;
