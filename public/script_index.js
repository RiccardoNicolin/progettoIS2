
function setUser(user){
    if (user != "000"){
        document.getElementById("user").innerHTML = user;
        document.getElementById("login").style.display = "none";
        document.getElementById("logout").style.display = "block";
    }else{
        document.getElementById("logout").style.display = "none";
    }
}

function Logout(){
    localStorage.setItem("token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9");
    document.getElementById("login").style.display = "block";
    document.getElementById("user").innerHTML = "";
    document.getElementById("logout").style.display = "none";
}

function creaLinks (){
    if (!localStorage.token){
        localStorage.setItem("token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9");
    }
   
   fetch('./home',
   {
       method: 'GET',
       headers: {
           Authorization: 'Bearer '+localStorage.getItem("token")
       }
   }
   )
   .then (res => res.json())
   .then (json => {
    setUser(json.verifydec.username);
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