

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

function setUser(user){
    let token = localStorage.getItem("token");
    if (token != "000"){
        document.getElementById("user").innerHTML = user;
        document.getElementById("login").style.display = "none";
        document.getElementById("logout").style.display = "block";
    }else{
        document.getElementById("logout").style.display = "none";
    }
}

function Logout(){
    localStorage.setItem("token", "000");
    document.getElementById("login").style.display = "block";
    document.getElementById("user").innerHTML = "";
    document.getElementById("logout").style.display = "none";
}

async function fetchserie(title){
    let response = await fetch('./series/'+title, {
        method:'GET',
        headers: {
            Authorization: 'Bearer '+localStorage.getItem("token")
        }
    });
    let data = await response.json();
    return data;
}
    function settaserie(all){ //parametro all = 1 se devo caricare tutta la pagine, altrimenti (uso 0) carica solo i commenti e i voti (ovvero le parti più variabili)
        const title = getParameterByName('name');
        fetch ('./series/'+title, {
            method:'GET',
            headers: {
                Authorization: 'Bearer '+localStorage.getItem("token")
            }
        })
        .then (res => res.json())
        .then (json => {
            if (all === 1){
                document.getElementById("titolo").innerHTML += json.selected.name;
                document.getElementById("attori").innerHTML += json.selected.actors;
                document.getElementById("genere").innerHTML += json.selected.genre;
                document.getElementById("locandina").innerHTML = '<img src='+json.selected.poster+' id="poster">';
                var s = json.selected.seasons;
                document.getElementById("stagioni").innerHTML += s.toString();
                document.getElementById("New_Comment").style.display = "none";
            }
            setUser(json.verifydec.username);
            document.getElementById("vote_total").innerHTML ="Score: "+ json.selected.score;
            DispalyComment(json.selected.comments);
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
            headers: { 'Content-Type': 'application/json',
                        Authorization:'Bearer '+localStorage.getItem("token")
                    },
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
        headers: { 'Content-Type': 'application/json',
                    Authorization:'Bearer '+localStorage.getItem("token")
                },
        body: JSON.stringify( {nome:title, score: points} )
    })
    .then(res => settaserie(0));
}
settaserie(1);
