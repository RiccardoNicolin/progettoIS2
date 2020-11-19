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
    res.status(200).json({
        self: '/series/' + serie.nome,
        nome : serie.nome,
        genere: serie.genere,
        attori: serie.attori,
        stagioni: serie.stagioni,
        locandina: serie.locandina
    });
});

router.post('/:nome', (req, res) => {
    //post comments forse voti
    let id = req.params.nome;
    let poster = req.params.poster;
    let comment = req.params.comment;
    if(poster === "undefined" | comment === "undefined"){
        res.status(500).json({message: "Missing parameters"});
    }
    else {
        let fullcomment = [{poster: poster, comment: comment}];
        db.lista_serie.
        res.status(201).json({message: "Comment Stored"})
    }
});

router.patch('/:nome', (req, res, next) =>{
    let id = req.params.nome;
    if(req.params.vote === "undefined"){

        if(req.params.target === "undefined" | req.params.change === "undefined"){
            res.status(500).json({message: "Missing Parameters"});
        }
        else {
            db.lista_serie.modificaCategoria(id, target, change);
            res.status(204).json({message: "Category successfuly updated"});
        }
    }
    else{
        db.lista_serie.modificaVoto(id, vote);
        res.status(204).json({message: "Vote successfully updated"});
    }
    //edit series forse voti
    
    
});

module.exports = router;