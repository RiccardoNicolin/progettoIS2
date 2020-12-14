const express = require('express');
const router = express.Router();
const user = require('./../../../DB/user');
var bcrypt = require('bcrypt');


// User signup
router.post('/', async (req, res, next) =>{
// Check if user submitted all fields
if (!req.body.email || !req.body.username || !req.body.password){
  res.status(500).json({message: "Username, Email and Password are mandatory"});
}
else {
  //checks if user email/name is already taken
  var foundemail =  await user.find('email', req.body.email)
  var foundusername = await user.find('username' ,req.body.username);
  //if it doesn't exist then create new user
  if (!foundemail && !foundusername){
    //hashing the password, salting it 10fold and checking if hash was successfull
    bcrypt.hash(req.body.password, 10, function (err, hashedpass) {
      if (err) {
        return res.status(500).json({message: "Error during password hashing"});
      }
      else {
        //non sono sicuro si faccia così
        user.addUser(req.body,hashedpass,  () => {
          res.status(201).location("/user/" + req.body.username).json({message:"User creation successful!"});
        });
      
      }
    });
  }
  //if username/email already exists error code
    else{
    res.status(500).json({message: "Error, username/email already existing"})
    }
}
});

module.exports = router;