function Login(){

    let user = document.getElementById("User").value;
    let pas  =document.getElementById("password").value;
    if (user.length == 0 || pas.length == 0){
        document.getElementById("message").innerHTML = "Please, compile all fields"
    }else{
        //implementare con il fetch del login
        sessionStorage.setItem("token", user);
        window.open("../","_self")
    }

}