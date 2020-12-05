const express = require('express');
const user = require('../../../DB/user');
const router = express.Router();
const serie = require('../../../DB/serie');



router.get('/', async (req, res) =>{
    //get req for home page, visualizes hot and new series for unsubscribed user

        let serieshot = await serie.findMore('tag', "hot"); //seleziona tutte le serie dove uno degli elementi del campo tag è quello specificato
        let seriesnew = await serie.findMore('tag', "new");
        
        let completo = {
            serieshot: serieshot,
            seriesnew: seriesnew
        };

        res.status(200).json(completo);

        
   
});

router.get('/userlist', async (req, res) => { 
    let userlist = await user.getAll();
    //userlist shown
    res.status(200).json(userlist);
});


module.exports = router;
