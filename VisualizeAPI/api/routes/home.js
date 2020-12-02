const express = require('express');
const user = require('../../../DB/user');
const router = express.Router();
const serie = require('../../../DB/serie');
const jwt = require("jsonwebtoken");


router.get('/', async (req, res) =>{
    //get req for home page, visualizes hot and new series for unsubscribed user
    try {
        //trying to look for token, if token is present and is valid also search the users bookmarked/in vision series
        const token = req.headers.authorization.split(" ")[1];
        const verifydec = jwt.verify(token, process.env.JWT_KEY);
        req.verifydec = verifydec;

    } catch (error){
        //if error businness as usual it's not logged in
            let serieshot = await serie.findMore('tag', "hot") //seleziona tutte le serie dove uno degli elementi del campo tag è quello specificato
            let seriesnew = await serie.findMore('tag', "new");
            res.status(200).json({
                serieshot,
                seriesnew,
                verifydec: undefined //pass invalid decoded token
                });
        }
            //TODO when merged put series bookmarked/in vision
            let serieshot = await serie.findMore('tag', "hot") //seleziona tutte le serie dove uno degli elementi del campo tag è quello specificato
            let seriesnew = await serie.findMore('tag', "new");
            res.status(200).json({
                serieshot,
                seriesnew,
                verifydec: verifydec //pass decoded token
                });

});

router.get('/userlist', async (req, res) => { 
    let userlist = await user.getAll();
    //userlist shown
    res.status(200).json(userlist);
});


module.exports = router;
