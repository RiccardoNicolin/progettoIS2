const express = require('express');
const router = express.Router();

router.get('/:nome', (req, res, next) =>{
    const id = req.params.nome;
    //get series
});

router.patch('/:nome', (req, res, next) =>{
    const id = req.params.nome;
    //edit series
});

module.exports = router;