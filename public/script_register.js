function registraUtente(){
    var user = document.getElementById("Username").value;
    console.log(user);
    var mail = document.getElementById("Email").value;
    var pass = document.getElementById("Password").value;
    if (user.length == 0 || mail.length==0 || pass.length==0){
        document.getElementById("Message").innerHTML = "COMPILARE TUTTI I CAMPI, GRAZIE";
    }else{
        fetch('../signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify( { username: user, email: mail, password:pass } )
        } )
        .then (res => res.json())
        .then(json => {
            document.getElementById("Message").innerHTML = json.message;
            return;
        })
        .catch( error => console.error(error) );
    }
    
};