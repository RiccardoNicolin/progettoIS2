var express    = require('express');
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt');
var app = express();

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.use('/', express.static('public'));

// starting the server
var port = process.env.PORT || 3000;
app.listen(port, function(){
  console.log('Server listening at http://localhost:' + port);  
});

// Definining a user

function Utente(username, password, email){
  this.username = username;
  this.password = password;
  this.email = email;
}

// User list

var userlist = [{
  username: "Admin",
  password: "Password",
  email: "admin@admin.it"  
}];

// User signup
app.post('/signup', function (req, res) {

  /*//check for existing email/username
  var found = userlist.find( (value) => {
    return (value.username == req.body.username | value.email == req.body.email);
  });
console.log(typeof found);*/

// Check if user submitted all fields
if (typeof (req.body.email) == "undefined" | (req.body.username) == "undefined" | typeof (req.body.password) == "undefined"){
  res.status(500).send("Username, Email and Password are mandatory")
}
else {
/*
  var foundemail = userlist.find( (value1) => {return (value1.email == req.body.email)});
  var foundusername = userlist.find( (value2) => {return (value2.username == req.body.username)});
  */
  var foundemail = userlist.find(req.body.email);
  var foundusername = userlist.find( (value2) => {return (value2.username == req.body.username)});
  console.log(typeof (foundemail));
  console.log(typeof (foundusername));
  //if it doesn't exist then create new user
  if (typeof (foundemail) == 'undefined' && typeof (foundusername) == 'undefined'){
    //hashing the password, salting it 10fold and checking if hash was successfull
    bcrypt.hash(req.body.password, 10, function (err, hashedpassword) {
      if (err) {
        return res.status(500).send("Error during password hashing");
      }
      else {
        const user = new Utente({
          username: req.body.username,
          email: req.body.email,
          password: hashedpassword,
         });
         
         userlist.push(user);
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

// Getting the list of users
app.get('/userlist', function (req, res) {
  res.send(userlist);
});
