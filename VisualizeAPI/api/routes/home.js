const express = require('express');
const user = require('../../../DB/user');
const router = express.Router();
const serie = require('../../../DB/serie');



router.get('/', async (req, res) =>{
    //get req for home page, visualizes hot and new series for unsubscribed user

        let serieshot = serie.findMore('tag', "hot") //seleziona tutte le serie dove uno degli elementi del campo tag è quello specificato
        let seriesnew = serie.findMore('tag', "new");
        res.status(200).json({
            serieshot,
            seriesnew
            });
   
});

router.get('/userlist', async (req, res) => { 
    let userlist = user.getAll();
    //userlist shown
    res.status(200).json(userlist);
});


module.exports = router;
