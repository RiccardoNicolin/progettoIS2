const express = require('express');
const router = express.Router();
const serie = require('../../../DB/serie.js');

router.get('/' , async (req, res, next) =>{
    // ritorna tutte le serie
    //let allSerie = await serie.find();
    res.status(200).json(await serie.getAll());
});

router.post('/', async (req, res) =>{
    //post req for home page, esempio postare manualmente hot in frontpage
    if (!req.body.name || !req.body.genre || !req.body.actors || !req.body.seasons || !req.body.poster || !req.body.tag){
        res.status(500).json({error: "Not all fields present"});
    }
    else{
        
        //checks if basic series data is present
        await serie.addSerie(req.body);
        res.status(201).json({message: 'Series added'});
    }
    
});

router.get('/:name', async (req, res) =>{
    const id = req.params.name;
    //get series info specifying by username
    console.log(id);
    let selected = await serie.get(id);
    console.log(selected);
    if(selected)
    {
        res.status(200).json(selected);
    }
    else
    {
        res.status(404).json({message: "Serie not found"});
    }
    
});

router.post('/:name', async (req, res) => {
    //post comments
    let id = req.params.name; //la serie 
    let poster = req.body.poster; //chi ha postato il commento
    let comment = req.body.comment; //il testo del commento
    if(!poster || !comment){
        res.status(500).json({message: "Missing parameters"});
    }
    else {
        
        await serie.addComment(id, poster, comment);
        res.status(201).json({message: "Comment Stored"});
    }
});

router.patch('/:name', async (req, res, next) =>{ 
    //Either register a new series vote or patch something about the series
    let id = req.params.name; //the series nome
    if(!req.body.score){
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
        //modifica voto
        await serie.modificaVoto(id, req.body.score);
        res.status(200).json({message: 'Vote successfully updated'});
    }
     
});

module.exports = router;