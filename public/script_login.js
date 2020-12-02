function Login(){

    let user = document.getElementById("User").value;
    let pas  =document.getElementById("password").value;

    if (user.length == 0 || pas.length == 0){
        document.getElementById("message").innerHTML = "Please, compile all fields"
    }else{
        //implementare con il fetch del login
        fetch('../login',
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify( { username: user, password:pas } )
            }
        ).then( res => res.json())
        .then( json => 
            {
                if (json.message === "Authentication successful"){
                    localStorage.setItem("token", json.token);
                    window.open("../","_self")
                }
                else {
                    document.getElementById("message").innerHTML = json.message;
                }
               
            }
        )
    }

}