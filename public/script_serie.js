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
    comments.map(element => document.getElementById("comments").innerHTML += '<span>Autore:'+element.poster+'</span><br><span>'+element.comment+'</span><hr>');
}
function settaserie(all){
    var title = getParameterByName('name');
    fetch('./series/'+title)
    .then((res) => res.json())
    .then (json => {
        if (all === 1){
            document.getElementById("titolo").innerHTML += json.nome;
            document.getElementById("attori").innerHTML += json.attori;
            document.getElementById("genere").innerHTML += json.genere;
            document.getElementById("locandina").innerHTML = '<img src='+json.locandina+' style="width:200px;height:200px;">';
            var s = json.stagioni;
            document.getElementById("stagioni").innerHTML += s.toString();
            document.getElementById("New_Comment").style.display = "none";
        }
        DispalyComment(json.commenti);
    });
}

function NewComment(){
    document.getElementById("New_Comment").style.display = "block";
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
           settaserie(0);
        });
    }
}

settaserie(1);
