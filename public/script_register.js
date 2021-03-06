function registraUtente(){
    var user = document.getElementById("Username").value;
    var mail = document.getElementById("Email").value;
    var pass = document.getElementById("Password").value;
    if (user.length == 0 || mail.length==0 || pass.length==0){
        document.getElementById("Message").innerHTML = "COMPILARE TUTTI I CAMPI, GRAZIE";
    }else{
        fetch('../signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json',
                        Authorization: 'Bearer '+localStorage.getItem("token")
        },
            body: JSON.stringify( { username: user, email: mail, password:pass } )
        } )
        .then (res => res.json())
        .then(json => {
            if (json.message == "User creation successful!"){
                window.open("../","_self")
            }
            else{
            document.getElementById("Message").innerHTML = json.message;
            }
        })
        .catch( error => console.error(error) );
    }
    
};