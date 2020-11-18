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
});

router.patch('/:nome', (req, res, next) =>{
    const id = req.params.nome;
    //edit series forse voti
    
    
});

module.exports = router;