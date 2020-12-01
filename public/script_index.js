
function setUser(){
    let user = sessionStorage.getItem("token");
    if (user != "000"){
        document.getElementById("user").innerHTML = user;
        document.getElementById("login").style.display = "none";
        document.getElementById("logout").style.display = "block";
    }else{
        document.getElementById("logout").style.display = "none";
    }
}

function Logout(){
    sessionStorage.setItem("token", "000");
    document.getElementById("login").style.display = "block";
    document.getElementById("user").innerHTML = "";
    document.getElementById("logout").style.display = "none";
}

function creaLinks (){
    if (!sessionStorage.token){
        sessionStorage.setItem("token", "000");
    }
    setUser();
   fetch('./home')
   .then (res => res.json())
   .then (json => {
       for (var i = 0; i < json.serieshot.length; i++){
            document.getElementById("link_serie_hot").innerHTML+= '<a href="./serie.html?name='+json.serieshot[i].name+'">'+json.serieshot[i].name+'</a><br>';
       }
       for (var i = 0; i < json.seriesnew.length; i++){
            document.getElementById("link_serie_new").innerHTML+='<a href="./serie.html?name='+json.seriesnew[i].name+'">'+json.seriesnew[i].name+'</a><br>';
        }
    });
}



 function Search(){
    const query = document.getElementById("search_bar").value;
    fetch('./series/')
    .then(res => res.json())
    .then(json => {
        const res = json.find(element => element.name== query);
        if (res === undefined){
            document.getElementById("result").innerHTML="No series with that name (beware of upper and lower case --> each word must have a capitol letter"
        }else{
            document.getElementById("result").innerHTML='RESULT: <a href="./serie.html?name='+res.name+'">'+res.name+'</a>';
        }
    });
}


creaLinks();