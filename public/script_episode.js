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
    const numep = getParameterByName('num');
    sessionStorage.setItem("old_url","../episode.html?name="+title+"&num="+numep);
    window.open("../login.html","_self")
}

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
        const res = json.allseries.filter(element => element.name.includes(query));
        console.log(res);
        if (res === undefined){
            document.getElementById("search_message").innerHTML="No series with that name (beware of upper and lower case --> each word must have a capitol letter"
        }else{
            document.getElementById("search_message").innerHTML="RESULT:   ";
            res.map(x => {
                document.getElementById("search_message").innerHTML+='<a href="./serie.html?name='+x.name+'">'+x.name+'</a>';
                document.getElementById("search_message").innerHTML+="    ";
            })
            
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
    settapagina(0);
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
        return user;
    }else{
        document.getElementById("logout").style.display = "none";
        document.getElementById("NotLog").style.display = "block";
        document.getElementById("open_form").style.display = "none";
        document.getElementById("New_Comment").style.display = "none";
        document.getElementById("register").style.display = "block";
        document.getElementById("cast_vote").style.display = "none";
        document.getElementById("seen_button").style.display = "none";
        return undefined;
    }
}


function settapagina(all){ //parametro all = 1 se devo caricare tutta la pagine, altrimenti (uso 0) carica solo i commenti e i voti (ovvero le parti più variabili)

        const title = getParameterByName('name');
        const numep = getParameterByName('num');
        fetch ('./series/'+title+'/'+numep, {
            method:'GET',
            headers: {
                Authorization: 'Bearer '+localStorage.getItem("token")
            }
        })
        .then (res => res.json())
        .then (json => {
            if (json.message === "Episode not existing in DB" ){
                document.getElementById("body").innerHTML = "<h1>EPISODE NOT FOUND, SORRY";
            }else{
                if (all === 1){
                    document.getElementById("titolo").innerHTML += json.selected.episodeName;
                    document.getElementById("attori").innerHTML += json.rootserie.actors;
                    document.getElementById("genere").innerHTML += json.rootserie.genre;
                    document.getElementById("locandina").innerHTML = '<img src='+json.rootserie.poster+' id="poster">';
                    var n = json.selected.episodeNumber;
                    document.getElementById("number").innerHTML += n.toString();
                    document.getElementById("New_Comment").style.display = "none";
                }
                setUser(json.verifydec.username);
                document.getElementById("already_watched").innerHTML = "";
                

                if (!json.isnotlast){
                    document.getElementById("Next").style.display="none";
                }
                else{
                    document.getElementById("Next").style.display="block";

                }

                if(json.selected.episodeNumber == 1){
                    document.getElementById("prec").style.display ="none";
                }else{
                    document.getElementById("prec").style.display ="block";

                }



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
                if (json.watched == 1){
                    document.getElementById("seen_button").style.display = "none";
                    document.getElementById("already_watched").innerHTML = "You have already seen this episode";
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
    const epnum = getParameterByName('num');
    if (text.length===0){
        document.getElementById("Message").innerHTML = "  One or more input left blank, please compile all fields";
    }else{
        document.getElementById("Message").innerHTML = "";
        fetch('../series/'+title+'/'+epnum, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json',
                        Authorization:'Bearer '+localStorage.getItem("token")
                    },
            body: JSON.stringify( {comment: text, watchupdate: 0} )
        })
        .then(res => {
            document.getElementById("New_Comment").style.display = "none";
            document.getElementById("open_form").style.display = "block";
           settapagina(0);
        });
    }
}

function AddVote(points){
    const title = getParameterByName('name');
    const epnum = getParameterByName('num');
    fetch('../series/'+title+'/'+epnum, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json',
                    Authorization:'Bearer '+localStorage.getItem("token")
                },
        body: JSON.stringify( {score: points} )
    })
    .then(res => settapagina(0));
}


function SetSeen(){
    const title = getParameterByName('name');
    const epnum = getParameterByName('num');
    fetch('../series/'+title+'/'+epnum, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json',
                    Authorization:'Bearer '+localStorage.getItem("token")
                },
        body: JSON.stringify( {watchupdate: 1} )
    })
    .then(res => settapagina(0));
};

function Next(){
    const title = getParameterByName('name');
    const epnum = getParameterByName('num');
    let next = +epnum + 1;
    window.open("../episode.html?name="+title+"&num="+next,"_self");
};

function Back(){
    const title = getParameterByName('name');
    window.open("../serie.html?name="+title,"_self");
};

function Prec(){
    const title = getParameterByName('name');
    const epnum = getParameterByName('num');
    let prev = +epnum -1 ;
    window.open("../episode.html?name="+title+"&num="+prev,"_self");
};


settapagina(1);

//TODO Add episode
//TODO Modify episode
//Maybe: % guardate su home


/*add episode to serie {
    POST a /series/name
    body: {episodeNumber: x,
            episodeName: name_ep
    }


*/