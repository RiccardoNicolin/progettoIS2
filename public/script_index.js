function Logout(){
    localStorage.setItem("token", "000");
    document.getElementById("login").style.display = "block";
    document.getElementById("user").innerHTML = "";
    document.getElementById("logout").style.display = "none";
    document.getElementById("register").style.display = "block";
    window.open("./","_self");
}

function Login(){
    sessionStorage.setItem("old_url","../");
    window.open("./login.html","_self");
}

function setUser(user){
    if (user === undefined){
        localStorage.setItem("token", "000");
        document.getElementById("login").style.display = "block";
        document.getElementById("user").innerHTML = "";
        document.getElementById("logout").style.display = "none";
        document.getElementById("register").style.display = "block";
    }
    let token = localStorage.getItem("token");
    if (token != "000"){
        document.getElementById("user").innerHTML = user;
        document.getElementById("login").style.display = "none";
        document.getElementById("logout").style.display = "block";
        document.getElementById("register").style.display = "none";
        document.getElementById("subbed").style.display = "block";
    }else{
        document.getElementById("logout").style.display = "none";
        document.getElementById("login").style.display = "block";
        document.getElementById("register").style.display = "block";
        document.getElementById("subbed").style.display = "none";
    }
}


function creaLinks (){
    if (!localStorage.token){
        localStorage.setItem("token", "000");
    }
   fetch('./home',
   {
       method: 'GET',
       headers: {
           Authorization: 'Bearer '+localStorage.getItem("token")
       }
   }
   )
   .then (res => res.json()
       )
   .then (json => {
       console.log(json);
    setUser(json.verifydec.username);
       for (var i = 0; i < json.serieshot.length; i++){
            document.getElementById("link_serie_hot").innerHTML+=
             '<div class="single"><a href="./serie.html?name='+json.serieshot[i].name+'"><img src='+json.serieshot[i].poster+'><br><span>'+json.serieshot[i].name+'</span></a></div>';
       }
       for (var i = 0; i < json.seriesnew.length; i++){
            document.getElementById("link_serie_new").innerHTML+='<div class="single"><a href="./serie.html?name='+json.seriesnew[i].name+'"><img src='+json.seriesnew[i].poster+'><br><span>'+json.seriesnew[i].name+'</span></a></div>';
       }
      if (json.serieswatched != undefined){
        for (var i = 0; i < json.serieswatched.length; i++){
            let already = json.serieswatched[i].nextToWatch - 1;
            document.getElementById("link_serie_seguite").innerHTML+=
            '<div class="single"><a href="./serie.html?name='+json.serieswatched[i].serie.name+'"><img src='+json.serieswatched[i].serie.poster+'><br><span>'+json.serieswatched[i].serie.name+'</span></a><br><p>'+already+'/'+json.serieswatched[i].numepisodes+'</p></div>';

            }
        }else{document.getElementById("subbed").style.display = "none";}

        if(json.verifydec.admin == 1){
            document.getElementById("AddSerie").innerHTML = '<a href="./add_serie.html">ADD SERIE<a>';
        }else{
            document.getElementById("AddSerie").innerHTML = "";
        }

    });
}



function Search(){
    const query = document.getElementById("search_bar").value;
    fetch('./series/',{
        method:'GET',
        headers: {
            Authorization: 'Bearer '+localStorage.getItem("token")
        }
    })
    .then(res => res.json())
    .then(json => {
        const res = json.allseries.filter(element => element.name.includes(query));
        console.log(res);
        if (res === undefined){
            document.getElementById("result").innerHTML="No series with that name (beware of upper and lower case --> each word must have a capitol letter"
        }else{
            document.getElementById("result").innerHTML="RESULT:   ";
            res.map(x => {
                document.getElementById("result").innerHTML+='<a href="./serie.html?name='+x.name+'">'+x.name+'</a>';
                document.getElementById("result").innerHTML+="    ";
            })
            
        }
    });
}


creaLinks();