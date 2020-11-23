const express = require('express');
const router = express.Router();
const db = require('../../../DB.js');

router.get('/' , (req, res, next) =>{
    // ritorna tutte le serie
    res.status(200).json(db.lista_serie.tutti());
});

router.post('/', (req, res) =>{
    //post req for home page, esempio postare manualmente hot in frontpage
    if (req.body.nome & req.body.genere & req.body.attori & req.body.stagioni){
        //checks if basic series data is present
        db.lista_serie.insert(req.body);
        res.status(201).json({message: 'Series added'});
    }
    else{
        res.status(500).json({error: "Not all fields present"});
    }
    
});

router.get('/:nome', (req, res, next) =>{
    const id = req.params.nome;
    //get series info specifying by username
    let serie = db.lista_serie.cercaPerNome(id);
    res.status(200).json({serie});
});

router.post('/:nome', (req, res) => {
    //post comments
    let id = req.params.nome; //la serie 
    let poster = req.body.poster; //chi ha postato il commento
    let comment = req.body.comment; //il testo del commento
    if(!poster | !comment){
        res.status(500).json({message: "Missing parameters"});
    }
    else {
        let fullcomment = {poster: poster, comment: comment};
        db.lista_serie.postaCommento(id, fullcomment);
        res.status(201).json({message: "Comment Stored"});
    }
});

router.patch('/:nome', (req, res, next) =>{ 
    //Either register a new series vote or patch something about the series
    let id = req.params.nome; //the series nome
    if(!req.body.vote){
        if(!req.body.target | !req.body.change){
            res.status(500).json({message: 'Missing data parameters'});
        }
        else {
            //modifica categoria, funziona testato per mandare attori o generi bisogna mandare più chiamate change con change[0],change[1]... change[x]
            db.lista_serie.modificaCategoria(id, req.body.target, req.body.change);
            res.status(200).json({message: 'Category successfuly updated'});
        }
    }
    else{
        //modifica voto
        db.lista_serie.modificaVoto(id, req.body.vote);
        res.status(200).json({message: 'Vote successfully updated'});
    }
    
    
    
});

module.exports = router;