
function Divide(arr){
    let changearray = arr.split(',');
    return changearray;
}


function AddSerie(){
    let title = document.getElementById("new_title").value;
    let poster = document.getElementById("new_poster").value;
    let seasons = document.getElementById("new_seasons").value;
    let genre = Divide( document.getElementById("new_genre").value);
    let tag = Divide (document.getElementById("new_tag").value);
    let actors = Divide (document.getElementById("new_actors").value);

if (title.length == 0 || poster.length==0 || seasons.length == 0 || genre.length == 0 || tag.length == 0 || actors.length == 0){
    document.getElementById("message").innerHTML = "Please, compile all field."
}else{
    fetch("./series/",{
    method:'POST',
    headers: { 'Content-Type': 'application/json',
                Authorization:'Bearer '+localStorage.getItem("token")
                    },
            body: JSON.stringify( {name: title, genre:genre, actors: actors,  seasons: seasons,   poster: poster, tag:tag} )
    })
    .then(res => res.json())
    .then (json => document.getElementById("message").innerHTML = json.message)
}

}