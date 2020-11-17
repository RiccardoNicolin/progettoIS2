const express = require('express');
const router = express.Router();
const db = require('../../../DB.js');

router.get('/', (req, res) =>{
    //get req for home page

        let serieshot = db.lista_serie.cercaSeHot(1);
        console.log(db.lista_serie.tutti());
        console.log(serieshot);
        let seriesnew = db.lista_serie.cercaSeNew(1);
        console.log(seriesnew);
        res.status(200).json({
            "Serie Hot":{serieshot},
            "Serie Nuove":{seriesnew}
            });
   
});

router.post('/', (req, res) =>{
    //post req for home page, esempio postare manualmente hot in frontpage
    if (typeof (req.body.nome) !== "undefined" & (req.body.genere) !== "undefined" & typeof (req.body.attori) !== "undefined" & typeof (req.body.Stagioni) !== "undefined"){
        //test
        console.log(req.body.nome);
        console.log(req.body.genere);
        console.log(req.body.attori);
        console.log(req.body.Stagioni);

        db.lista_serie.insert(req.body);
        res.status(201).json({message: 'Series added'});
    }
    else{
        res.status(500).json({error: "Not all fields present"})
    }
    
});



module.exports = router;

/*{
                    self: '/series/' + serie.nome,
                    nome : serie.nome,
                    genere: serie.genere,
                    attori: serie.attori,
                    Stagioni: serie.Stagioni
                }*/