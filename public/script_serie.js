

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

async function fetchserie(title){ //parametro all = 1 se devo caricare tutta la pagine, altrimenti (uso 0) carica solo i commenti e i voti (ovvero le parti più variabili)
    let response = await fetch('./series/'+title);
    let data = await response.json();
    return data;
}
    function settaserie(all){
        const title = getParameterByName('name');
        fetchserie(title)
        .then (data => {
            if (all === 1){
                document.getElementsByTagName("title").innerHTML = data.name;
                document.getElementById("titolo").innerHTML += data.name;
                document.getElementById("attori").innerHTML += data.actors;
                document.getElementById("genere").innerHTML += data.genre;
                document.getElementById("locandina").innerHTML = '<img src='+data.poster+' id="poster">';
                var s = data.seasons;
                document.getElementById("stagioni").innerHTML += s.toString();
                document.getElementById("New_Comment").style.display = "none";
            }
            document.getElementById("vote_total").innerHTML ="Score: "+ data.score;
            DispalyComment(data.comments);
        })
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
            body: JSON.stringify( {poster: author, comment: text} )
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
