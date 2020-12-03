const express = require('express');
const router = express.Router();
const userdb = require('../../../DB/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();



router.post('/', async (req, res) =>{
    //check if the user exists
    let user= await userdb.find("username", req.body.username);
    if (user){    
        //checking if the password is correct
        bcrypt.compare(req.body.password, user.password, (err, result) => {
            if (err){
                res.status(401).json({
                    message: "Authentication unsuccessful, retry using other data"
                });
            }
            //if the password is correct create a jwt token and send it back
           else  if (result){
                const token = jwt.sign({
                    email: user.email,
                    username: user.username,
                    admin: user.admin
                }, process.env.JWT_KEY, {
                    expiresIn: "1s"
                } )
                return res.status(200).json({
                    message: "Authentication successful",
                    token:token
                });
            }else
            //failing password check
            res.status(401).json({
                message: "Authentication unsuccessful, retry using other data",
            });
        });

    }
    else {
        //fail for non existing user
        res.status(401).json({
            message: "Authentication unsuccessful, retry using other data"
        });
    }
});





module.exports = router;