const express = require('express');
const router = express.Router();
const serie = require('../../../DB/serie.js');
const checkAuth = require('../middleware/checkauth');

router.get('/' , async (req, res, next) =>{
    // ritorna tutte le serie
    //let allSerie = await serie.find();
    let allseries = await serie.getAll();
    try {
        //trying to look for token, if token is present and is valid also search the users bookmarked/in vision series
        const token = req.headers.authorization.split(" ")[1];
        const verifydec = jwt.verify(token, process.env.JWT_KEY);
        req.verifydec = verifydec;

    } catch (error){
    res.status(200).json({
        allseries: allseries,
        verifydec: undefined
    });
    }
    res.status(200).json({
        allseries: allseries,
        verifydec: verifydec
    })
});

router.post('/', checkAuth, async (req, res) =>{
    //post req for home page, esempio postare manualmente hot in frontpage
    if (req.body.verifydec.admin){
    if (!req.body.nome || !req.body.genre || !req.body.actors || !req.body.seasons || !req.body.poster || !req.body.tag){
        res.status(500).json({error: "Not all fields present"});
    }
    else{
        
        //checks if basic series data is present
        await serie.addSerie(req.body);
        res.status(201).json({message: 'Series added'});
    }
}
else{
    res.status(401).json({
        message: "Lacking administration privileges to do this action"
    });
}
});

router.get('/:name', async (req, res, next) =>{
    const id = req.params.name;
    //get series info specifying by username
    let selected = await serie.get(id);

    try {
        //trying to look for token, if token is present and is valid also search the users bookmarked/in vision series
        const token = req.headers.authorization.split(" ")[1];
        const verifydec = jwt.verify(token, process.env.JWT_KEY);
        req.verifydec = verifydec;

    } catch (error){
        if(selected)
    {
        res.status(200).json({
            selected: selected,
            verifydec: undefined
        });
    }
    }

    if(selected)
    {
        res.status(200).json({
            selected: selected,
            verifydec: verifydec
        });
    }
    
});

router.post('/:name', checkAuth, async (req, res) => {
    //post comments
    let id = req.params.name; //la serie 
    let poster = req.body.verifydec.username; //chi ha postato il commento
    let comment = req.body.comment; //il testo del commento
    if(!poster || !comment){
        res.status(500).json({message: "Missing parameters"});
    }
    else {
        
        await serie.addComment(id, poster, comment);
        res.status(201).json({message: "Comment Stored"});
    }
});

router.patch('/:name', checkAuth, async (req, res, next) =>{ 
    //Either register a new series vote or patch something about the series
    let id = req.params.name; //the series nome
    if(!req.body.score){
        if (req.body.verifydec.admin){
        if(!req.body.target || !req.body.change){
            res.status(500).json({message: 'Missing data parameters'});
        }
        else { //DA SISTEMARE!!!!!!!!

            //modifica categoria, funziona testato per mandare attori o generi bisogna mandare più chiamate change con change[0],change[1]... change[x]
           // serie.updateOne({name: id}{$req.body.target : req.body.change}) 


           //COME DEFERENZIARE IL CAMPO DA UPDATARE???????

           /* old code
            db.lista_serie.modificaCategoria(id, req.body.target, req.body.change);
            */
            await serie.modify(id, req.body.taget, req.body.change);

            res.status(200).json({message: 'Category successfuly updated'});

        }
     }

     else{
        res.status(401).json({
            message: "Lacking administration privileges to do this action"
        })
    }

    }
    else{
        //modifica voto
        await serie.modificaVoto(id, req.body.score);
        res.status(200).json({message: 'Vote successfully updated'});
    }
     
});

module.exports = router;