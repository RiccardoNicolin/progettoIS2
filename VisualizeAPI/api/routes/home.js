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

router.post('/', (req, res) =>{
    //post req for home page, esempio postare manualmente hot in frontpage
    if (typeof (req.body.nome) !== undefined & (req.body.genere) !== undefined & typeof (req.body.attori) !== undefined & typeof (req.body.Stagioni) !== undefined){
        //DEVO TESTARE CHE TUTTI I CAMPI SIANO INSERITI (ECCETTO VOTO E COMMENTI)
        db.lista_serie.insert(req.body);
        res.status(201).json({message: 'Series added'});
    }
    else{
        res.status(500).json({error: "Not all fields present"})
    }
    
});


module.exports = router;
