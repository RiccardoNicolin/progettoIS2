const express = require('express');
const router = express.Router();
const db = require('../../../DB.js');

router.get('/:nome', (req, res, next) =>{
    const id = req.params.nome;
    //get series
    let serie = db.lista_serie.cercaPerNome(id);
    res.status(200).json({
        self: '/series/' + serie.nome,
        nome : serie.nome,
        genere: serie.genere,
        attori: serie.attori,
        stagioni: serie.stagioni,
        locandina: serie.locandina
    });
});

router.patch('/:nome', (req, res, next) =>{
    const id = req.params.nome;
    //edit series
});

module.exports = router;