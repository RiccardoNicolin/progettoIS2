
function registraUtente(){
    var user = document.getElementById("Username").value;
    console.log(user);
    var mail = document.getElementById("Email").value;
    var pass = document.getElementById("Password").value;
    if (user.length == 0 || mail.length==0 || pass.length==0){
        document.getElementById("Message").innerHTML = "COMPILARE TUTTI I CAMPI, GRAZIE";
    }else{
        fetch('../appwithsalting.js', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify( { username: user, email: mail, password:pass } )
        } )
        .then((resp) => {
            document.getElementById("Message").innerHTML = resp;
            return;
        })
        .catch( error => console.error(error) ); // If there is any error you will catch them here
    
    }
    
};