const express = require('express');
const router = express.Router();
const serie = require('../../../DB/serie.js');

router.get('/' , async (req, res, next) =>{
    // ritorna tutte le serie
    let allSerie = await serie.find();
    res.status(200).json(allSerie);
});

router.post('/', async (req, res) =>{
    //post req for home page, esempio postare manualmente hot in frontpage
    if (!req.body.nome || !req.body.genere || !req.body.attori || !req.body.stagioni || !req.body.poster || !req.body.tag){
        res.status(500).json({error: "Not all fields present"});
    }
    else{
        
        //checks if basic series data is present
        /*let newSerie = {
        name: req.body.nome,
        poster: req.body.poster,
        genre: req.body.genere,
        tag: req.body.tag,
        score: 0,
        numberOfvotes: 0,
        actors: req.body.attori,
        seasons: req.body.stagioni,
        comments: []
        }
        new serie(newSerie).save();*/
        serie.addSerie(req.body);
        res.status(201).json({message: 'Series added'});
    }
    
});

router.get('/:name', async (req, res, next) =>{
    const id = req.params.name;
    //get series info specifying by username
    let selected = await serie.findOne({name: id});
    res.status(200).json(selected);
});

router.post('/:name', (req, res) => {
    //post comments
    let id = req.params.name; //la serie 
    let poster = req.body.poster; //chi ha postato il commento
    let comment = req.body.comment; //il testo del commento
    if(!poster || !comment){
        res.status(500).json({message: "Missing parameters"});
    }
    else {
        let fullcomment = {poster: poster, comment: comment};
         serie.updateOne(
           {name: id}, //seleziono la serie con nome == id (ovvero quella che mi serve)
           {$push:  //insersco in fondo all'array
                {comments: //nome del campo array
                    {poster: poster,comment: comment} //oggetto che viene inserito
                }
            }
    ).then();
        res.status(201).json({message: "Comment Stored"});
    }
});

router.patch('/:name', async (req, res, next) =>{ 
    //Either register a new series vote or patch something about the series
    let id = req.params.name; //the series nome
    if(!req.body.vote){
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
            res.status(200).json({message: 'Category successfuly updated'});

        }
    }
    else{
        //modifica voto
       /*let target = await serie.findOne({name: id});
       //il secondo oggetto rappresenta quello che vine ritornato, in questo caso il primo valore del campo score
       //se _id: 0 non viene inserito, _id iene ritornato di default
       let old_num =target.numberOfvotes;
       let old_score = target.score;
       let new_num = old_num+1;
        let new_score = ((old_score * old_num)+req.body.vote) / new_num;
        serie.updateOne({name: id},{score: new_score, numberOfvotes:new_num}).then();*/
        serie.modificaVoto(id, req.body.vote);
        res.status(200).json({message: 'Vote successfully updated'});
    }
    
    
    
});

module.exports = router;