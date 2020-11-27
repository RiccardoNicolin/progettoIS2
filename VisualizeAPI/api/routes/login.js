const express = require('express');
const router = express.Router();
const db = require('../../../DB.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

router.post('/', (req, res) =>{
    let user= db.lista_utenti.cercaPerNome(req.body.username);
    console.log(user);
    if (user.username.length >= 1){
        bcrypt.compare(req.body.password, user.password, (err, result) => {
            if (err){
                res.status(401).json({
                    message: "Authentication unsuccessful, retry using other data 1"
                });
            }

            if (result){
                const token = jwt.sign({
                    email: user.email,
                    username: user.username,

                }, process.env.JWT_KEY, {
                    expiresIn: "1h"
                } )
                return res.status(200).json({
                    message: "Authentication successful",
                    token: token
                });
            }

            res.status(401).json({
                message: "Authentication unsuccessful, retry using other data 2",
            });
        });

    }
    else {
        res.status(401).json({
            message: "Authentication unsuccessful, retry using other data 3"
        });
    }
});





module.exports = router;