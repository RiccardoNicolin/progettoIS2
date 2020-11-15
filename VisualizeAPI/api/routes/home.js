const express = require('express');
const router = express.Router();

router.get('/', (req, res) =>{
    //get req for home page

        let serieshot = DB.lista_serie.cercaPerGenere('hot').map( (serie) => {
            return {
                self: '/series/' + serie.nome,
                title: serie.nome
            };
        });
        res.status(200).send('this are the series in hot').json(serieshot);
   
});

router.post('/', (req, res, next) =>{
    //post req for home page, esempio postare manualmente hot in frontpage
});



module.exports = router;