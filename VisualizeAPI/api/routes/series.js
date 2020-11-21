const express = require('express');
const router = express.Router();
const db = require('../../../DB.js');

router.get('/' , (req, res, next) =>{
    // ritorna tutte le serie please
    res.send(db.lista_serie.tutti());
});

router.get('/:nome', (req, res, next) =>{
    const id = req.params.nome;
    //get series
    let serie = db.lista_serie.cercaPerNome(id);
    console.log(serie);
    res.status(200).json({serie});
});

router.post('/:nome', (req, res) => {
    //post comments forse voti
    let id = req.params.nome; //la serie 
    let poster = req.body.poster; //chi ha postato il commento
    let comment = req.body.comment; //il testo del commento
    if(poster === undefined | comment === undefined){
        res.status(500).json({message: "Missing parameters"});
    }
    else {
        let fullcomment = {poster: poster, comment: comment};
        db.lista_serie.postaCommento(id, fullcomment);
        res.status(201).json({message: "Comment Stored"});
    }
});

router.patch('/:nome', (req, res, next) =>{ //json message ROTTO TODO
    let id = req.params.nome; //la serie
    console.log(id);
    if(req.body.vote === undefined){
        console.log("didn't see vote");
        if(req.body.target === undefined | req.body.change === undefined){
            console.log("sono entrato into 500");
            res.status(500).json({message: 'Missing data parameters'});
        }
        else {
            //modifica categoria, funziona testato per mandare attori o generi bisogna mandare più chiamate change con change[0],change[1]... change[x]
            console.log("sono entrato in modifica");
            db.lista_serie.modificaCategoria(id, req.body.target, req.body.change);
            console.log("sono uscito dalla modifica");
            res.status(200).json({message: 'Category successfuly updated'});
        }
    }
    else{
        //modifica voto, testato funziona
        console.log("did see vote");
        console.log(req.body.vote);
        db.lista_serie.modificaVoto(id, req.body.vote);
        console.log("did something in the function");
        res.status(200).json({message: 'Vote successfully updated'});
    }
    
    
    
});

//not utilized testing
router.get('/:nome/voto', (req, res) =>{
    let id = req.params.nome;
    res.status(200).json(db.lista_serie.mostravoto(id));
});

module.exports = router;