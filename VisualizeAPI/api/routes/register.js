var bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const db = require('../../../DB.js');


// User signup
router.post('/', (req, res, next) =>{
console.log(req.body.email);
console.log(req.body.username);

// Check if user submitted all fields
if (typeof (req.body.email) == "undefined" | (req.body.username) == "undefined" | typeof (req.body.password) == "undefined"){
  res.status(500).send("Username, Email and Password are mandatory")
}
else {

  var foundemail = db.lista_utenti.cercaPerMail(req.body.email);
  var foundusername = db.lista_utenti.cercaPerNome(req.body.username);
  console.log(typeof (foundemail));
  console.log(typeof (foundusername));
  //if it doesn't exist then create new user
  if (typeof (foundemail) == 'undefined' && typeof (foundusername) == 'undefined'){
    //hashing the password, salting it 10fold and checking if hash was successfull
    bcrypt.hash(req.body.password, 10, function (err, hashedpass) {
      if (err) {
        return res.status(500).send("Error during password hashing");
      }
      else {
        db.dati.lista_utenti.push({
          username: req.body.username,
          email: req.body.email,
          password: hashedpass  
        });
         
         res.status(201).location("/user/" + req.body.username).send("User creation successful!");
      }
    });
  }
  //if username/email already exists error code
   else{
   res.status(500).send("Error, username/email already existing")
   }
}
});