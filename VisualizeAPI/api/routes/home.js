const express = require('express');
const user = require('../../../DB/user');
const router = express.Router();
//const db = require('../../../DB.js');
const serie = require('../../../DB/serie');



router.get('/', async (req, res) =>{
    //get req for home page, visualizes hot and new series for unsubscribed user

        let serieshot = await serie.find({tag: "hot"});  //seleziona tutte le serie dove uno degli elementi del campo tag è quello specificato
        let seriesnew = await serie.find({tag: "new"});
        res.status(200).json({
            serieshot,
            seriesnew
            });
   
});

router.get('/userlist', async (req, res) => { 
    let userlist = await user.find();
    //userlist shown
    res.status(200).json(userlist);
});




module.exports = router;
