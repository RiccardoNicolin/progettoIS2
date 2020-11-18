
function creaLinks (){
   fetch('./home')
   .then (res => res.json())
   .then (json => {
       for (var i = 0; i < json.serieshot.length; i++){
            document.getElementById("link_serie_hot").innerHTML+= '<a href="./serie.html?nome='+json.serieshot[i].nome+'">'+json.serieshot[i].nome+'</a><br>';
       }
       for (var i = 0; i < json.seriesnew.length; i++){
            document.getElementById("link_serie_new").innerHTML+='<a href="./serie.html?nome='+json.seriesnew[i].nome+'">'+json.seriesnew[i].nome+'</a><br>';
        }
    });
}
creaLinks();