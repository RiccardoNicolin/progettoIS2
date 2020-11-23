const express = require('express');
const router = express.Router();
const db = require('../../../DB.js');
var bcrypt = require('bcrypt');


// User signup
router.post('/', (req, res, next) =>{
// Check if user submitted all fields
if (typeof (req.body.email) == undefined | (req.body.username) == undefined | typeof (req.body.password) == undefined){
  res.status(500).send("Username, Email and Password are mandatory")
}
else {
  //checks if user email/name is already taken
  var foundemail = db.lista_utenti.cercaPerMail(req.body.email);
  var foundusername = db.lista_utenti.cercaPerNome(req.body.username);
  //if it doesn't exist then create new user
  if (typeof (foundemail) == 'undefined' && typeof (foundusername) == 'undefined'){
    //hashing the password, salting it 10fold and checking if hash was successfull
    bcrypt.hash(req.body.password, 10, function (err, hashedpass) {
      if (err) {
        return res.status(500).send("Error during password hashing");
      }
      else {
        let user = {username: req.body.username, email: req.body.email, password: hashedpass};
        db.lista_utenti.insert(user);
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

module.exports = router;