function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
};

function Login(){
    const title = getParameterByName('name');
    sessionStorage.setItem("old_url","../serie.html?name="+title);
    window.open("../login.html","_self")
}

function Search(){
    const query = document.getElementById("search_bar").value;
    sessionStorage.setItem("query",query)
    window.open('./search.html',"self");
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
    localStorage.setItem("token", "000");
    document.getElementById("login").style.display = "block";
    document.getElementById("user").innerHTML = "";
    document.getElementById("logout").style.display = "none";
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
        document.getElementById("subscribe").style.display = "block";
        return user;
    }else{
        document.getElementById("logout").style.display = "none";
        document.getElementById("NotLog").style.display = "block";
        document.getElementById("open_form").style.display = "none";
        document.getElementById("New_Comment").style.display = "none";
        document.getElementById("register").style.display = "block";
        document.getElementById("cast_vote").style.display = "none";
        document.getElementById("subscribe").style.display = "none";
        return undefined;
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
            if (json.message == "serie not found"){
                document.getElementById("body").innerHTML = "<h1>SORRY, THIS SERIE DOESN'T EXIST </h1> "
            }else{
                
                if (all === 1){
                    document.getElementById("titolo").innerHTML += json.selected.name;
                    document.getElementById("attori").innerHTML += json.selected.actors;
                    document.getElementById("genere").innerHTML += json.selected.genre;
                    document.getElementById("locandina").innerHTML = '<img src='+json.selected.poster+' id="poster">';
                    var s = json.selected.seasons;
                    document.getElementById("stagioni").innerHTML += s.toString();
                    document.getElementById("New_Comment").style.display = "none";
                }
                document.getElementById("track_record").innerHTML = '<a href="./episode.html?name='+title+'&num='+1+'">FIRST EPISODE</a>'
                let user = setUser(json.verifydec.username);
                console.log(json);
                if (user!= undefined){
                    if (json.watched != 0 ){
                    document.getElementById("sub_button").style.display = "none";
                    if (json.numepisodes >= json.watched){
                        document.getElementById("track_record").innerHTML += '<br><a href="./episode.html?name='+title+'&num='+json.watched+'">Next episode: '+json.watched+'</a>'
                    }else{
                        document.getElementById("track_record").innerHTML += '<p> You have finished this serie</p>'
                    }
                    }
                }
            
            
                if (json.verifydec.admin == 1){
                    document.getElementById("mod").style.display = "block";
                    document.getElementById("mod").innerHTML = '<a href="./modify_serie.html?name='+json.selected.name+'">MODIFY</a><br>'
                    document.getElementById("mod").innerHTML += '<a href="./add_episode.html?name='+json.selected.name+'">ADD EPISODE</a><br>'
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
                if (json.watched != 0){
                    document.getElementById("subscribe").display = "none";
                }
            }
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



function Subscribe(){
    const title = getParameterByName('name');
    fetch('./series/'+title, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer '+localStorage.getItem("token")
        },
        body: JSON.stringify( {watchednum: 1} )
    })
    .then (res => res.json())
    .then(json => {
        settaserie(0);
    })
}


settaserie(1);

