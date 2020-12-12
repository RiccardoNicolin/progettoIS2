const express = require('express');
const user = require('../../../DB/user');
const router = express.Router();
const serie = require('../../../DB/serie');
const jwt = require("jsonwebtoken");
const checkAuth = require('../middleware/checkauth');

router.get('/', async (req, res) => {
    //get req for home page, visualizes hot and new series for unsubscribed user
    let token = req.headers.authorization.split(" ")[1];
    if (token != "000"){
        try {
            //trying to look for token, if token is present and is valid also search the users bookmarked/in vision series
                let token = req.headers.authorization.split(" ")[1];
                const verifydec = jwt.verify(token, process.env.JWT_KEY);
                let serieshot = await serie.findMore('tag', "hot"); //seleziona tutte le serie dove uno degli elementi del campo tag è quello specificato
                let seriesnew = await serie.findMore('tag', "new");
                let serieswatched = await user.findAllWatched(verifydec.username);
                if (serieswatched == 0){
                    res.status(200).json({
                        serieshot,
                        seriesnew,
                        verifydec: verifydec//pass decoded token
                    });
                }
                else{
                    res.status(200).json({
                        serieshot,
                        seriesnew,
                        serieswatched,
                        verifydec: verifydec//pass decoded token
                    });
                }
                
            }
        catch (error) {
            //if error businness as usual it's not logged in
            let serieshot = await serie.findMore('tag', "hot") //seleziona tutte le serie dove uno degli elementi del campo tag è quello specificato
            let seriesnew = await serie.findMore('tag', "new");
            res.status(200).json({
                serieshot,
                seriesnew,
                verifydec: "" //pass invalid decoded token
            });
        }
    
    //TODO when merged put series bookmarked/in vision
    
    /* let token = req.headers.authorization.split(" ")[1];
    let verifydec = jwt.verify(token, process.env.JWT_KEY);*/
   
    }
    else{
        let serieshot = await serie.findMore('tag', "hot") //seleziona tutte le serie dove uno degli elementi del campo tag è quello specificato
        let seriesnew = await serie.findMore('tag', "new");
        res.status(200).json({
            serieshot,
            seriesnew,
            verifydec: "" //pass invalid decoded token
        });
    }
});

router.get('/userlist', async (req, res) => {
    let userlist = await user.getAll();
    //userlist shown
    res.status(200).json(userlist);
});


module.exports = router;
