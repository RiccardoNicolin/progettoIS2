
function creaLinks (){
   fetch('http://localhost:3000/series')
   .then (res => res.json())
   .then (json => {
       for (var i=0; i<json.length; i++){
        document.getElementById("link_serie").innerHTML += '<a href=./serie.html?nome=' +json[i].nome+'>'+json[i].nome+'</a><br>';
       }
   })
   }
creaLinks();