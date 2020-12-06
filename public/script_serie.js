

function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
};

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
        const res = json.allseries.find(element => element.name == query);
        if (res === undefined){
            document.getElementById("search_message").innerHTML="No series with that name (beware of upper and lower case --> each word must have a capitol letter"
        }else{
            document.getElementById("search_message").innerHTML='RESULT: <a href="./serie.html?name='+res.name+'">'+res.name+'</a>';
        }
    });
}

function DispalyComment(comments){
    document.getElementById("comments").innerHTML = "";
    comments.map(element => document.getElementById("comments").innerHTML += '<span>Autore:'+element.poster+'</span><hr class="aut-comm"><span>'+element.comment+'</span><hr class="next">');
}

function Logout(){
    localStorage.setItem("token", "000");
    document.getElementById("login").style.display = "block";
    document.getElementById("user").innerHTML = "";
    document.getElementById("logout").style.display = "none";
    settaserie(0);
}

function setUser(user){
    if (user === undefined){
        Logout();
    }
    let token = localStorage.getItem("token");
    if (token != "000"){
        document.getElementById("user").innerHTML = user;
        document.getElementById("login").style.display = "none";
        document.getElementById("logout").style.display = "block";
        document.getElementById("NotLog").style.display = "none";
        document.getElementById("open_form").style.display = "block";
        document.getElementById("register").style.display = "none";
        document.getElementById("cast_vote").style.display = "block";
    }else{
        document.getElementById("logout").style.display = "none";
        document.getElementById("NotLog").style.display = "block";
        document.getElementById("open_form").style.display = "none";
        document.getElementById("New_Comment").style.display = "none";
        document.getElementById("register").style.display = "block";
        document.getElementById("cast_vote").style.display = "none";
    }
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

           
            if (json.verifydec.admin == 1){
                document.getElementById("mod").style.display = "block";
                document.getElementById("mod").innerHTML = '<a href="./modify_serie.html?name='+json.selected.name+'">MODIFY</a><br>'
            }
            else{
                document.getElementById("mod").style.display = "none";
                document.getElementById("mod").innerHTML = '';
            }
            if (localStorage.getItem("token") != "000"){
            let v = json.verifydec.voted;
                for (var i=1; i<=5; i++){
                    if (i==v){
                        document.getElementById("vote"+i).style.backgroundColor = "yellow";
                    }else {
                        document.getElementById("vote"+i).style.backgroundColor = "white";
                    }
                }
             }
            document.getElementById("vote_total").innerHTML ="Score: "+ json.selected.score;
            DispalyComment(json.selected.comments);
        })
    }

function NewComment(){
    document.getElementById("New_Comment").style.display = "block";
    document.getElementById("open_form").style.display = "none";
}

function CreateComment(){
    const text = document.getElementById("comment_text").value;
    const title = getParameterByName('name');
    if (text.length===0){
        document.getElementById("Message").innerHTML = "  One or more input left blank, please compile all fields";
    }else{
        document.getElementById("Message").innerHTML = "";
        fetch('../series/'+title, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json',
                        Authorization:'Bearer '+localStorage.getItem("token")
                    },
            body: JSON.stringify( {comment: text} )
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
        body: JSON.stringify( {score: points} )
    })
    .then(res => settaserie(0));
}
settaserie(1);
