function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
};

function DispalyComment(comments){
    document.getElementById("comments").innerHTML = "";
    comments.map(element => document.getElementById("comments").innerHTML += '<span>Autore:'+element.poster+'</span><hr class="aut-comm"><span>'+element.comment+'</span><hr class="next">');
}
function settaserie(all){ //parametro all = 1 se devo caricare tutta la pagine, altrimenti (uso 0) carica solo i commenti e i voti (ovvero le parti più variabili)
    var title = getParameterByName('name');
    fetch('./series/'+title)
    .then((res) => res.json())
    .then (json => {
        if (all === 1){
            document.getElementsByTagName("title").innerHTML = title;
            document.getElementById("titolo").innerHTML += json.serie.nome;
            document.getElementById("attori").innerHTML += json.serie.attori;
            document.getElementById("genere").innerHTML += json.serie.genere;
            document.getElementById("locandina").innerHTML = '<img src='+json.serie.locandina+' id="poster">';
            var s = json.serie.stagioni;
            document.getElementById("stagioni").innerHTML += s.toString();
            document.getElementById("New_Comment").style.display = "none";
        }
        document.getElementById("vote_total").innerHTML ="Score: "+ json.serie.voto;
        DispalyComment(json.serie.commenti);
    });
}

function NewComment(){
    document.getElementById("New_Comment").style.display = "block";
    document.getElementById("open_form").style.display = "none";
}

function CreateComment(){
    const author = document.getElementById("comment_author").value;
    const text = document.getElementById("comment_text").value;
    const title = getParameterByName('name');
    if (author.length === 0 || text.length===0){
        document.getElementById("Message").innerHTML = "  One or more input left blank, please compile all fields";
    }else{
        document.getElementById("Message").innerHTML = "";
        fetch('../series/'+title, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify( {id: title, poster: author, comment: text} )
        })
        .then(res => {
            document.getElementById("New_Comment").style.display = "none";
            document.getElementById("open_form").style.display = "block";
           settaserie(0);
        });
    }
}

function AddVote(points){
    const title = getParameterByName('name');
    fetch('../series/'+title, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( {nome:title, vote: points} )
    })
    .then(res => settaserie(0));
}
settaserie(1);
