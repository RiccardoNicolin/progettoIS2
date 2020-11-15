const express = require('express');
const router = express.Router();
const db = require('../../../DB.js');

router.get('/', (req, res) =>{
    //get req for home page

        let serieshot = db.lista_serie.tutti().filter( (serie) => {
            serie.genere === 'hot';
            return {
                self: '/series/' + serie.nome,
                title: serie.nome
            };
        });
        res.status(200)/*.send('this are the series in hot')*/.json(serieshot);
   
});

router.post('/', (req, res, next) =>{
    //post req for home page, esempio postare manualmente hot in frontpage
});



module.exports = router;