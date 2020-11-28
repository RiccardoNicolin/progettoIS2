
function creaLinks (){
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
        const res = json.find(element => element.nome== query);
        if (res === undefined){
            document.getElementById("result").innerHTML="No series with that name (beware of upper and lower case --> each word must have a capitol letter"
        }else{
            document.getElementById("result").innerHTML='RESULT: <a href="./serie.html?name='+res.nome+'">'+res.nome+'</a>';
        }
    });
}


creaLinks();