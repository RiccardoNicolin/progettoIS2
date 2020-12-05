
function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
};

function SetPage(){
    const title = getParameterByName('name');
    fetch('../series/'+title,{
        method:'GET',
        headers: {
            Authorization: 'Bearer '+localStorage.getItem("token")
        }
    } )
    .then(res => res.json())
    .then (json => {
        document.getElementById("actual_title").innerHTML = json.selected.name;
        document.getElementById("actual_poster").innerHTML = json.selected.poster;
        var s = json.selected.seasons;
        document.getElementById("actual_seasons").innerHTML = s.toString();
    });
}

function SetPageNewT(title){
    fetch('../series/'+title,{
        method:'GET',
        headers: {
            Authorization: 'Bearer '+localStorage.getItem("token")
        }
    } )
    .then(res => res.json())
    .then (json => {
        document.getElementById("actual_title").innerHTML = json.selected.name;
        document.getElementById("actual_poster").innerHTML = json.selected.poster;
        var s = json.selected.seasons;
        document.getElementById("actual_seasons").innerHTML = s.toString();
    });
}
SetPage();

function Modify_Title(){
    const title = getParameterByName('name');
    let change = document.getElementById("new_title").value;
    if (change.length != 0){
        fetch('../series/'+title, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json',
                        Authorization:'Bearer '+localStorage.getItem("token")
                    },
            body: JSON.stringify( {target: 'name', change: change} )
        }) .then(res => SetPageNewT(change))
    }
}

function Modify_Poster(){
    const title = document.getElementById("actual_title").innerHTML;
    let change = document.getElementById("new_poster").value;
    if (change.length != 0){
        fetch('../series/'+title, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json',
                        Authorization:'Bearer '+localStorage.getItem("token")
                    },
            body: JSON.stringify( {target: 'poster', change: change} )
        })
        .then(res => SetPageNewT(title))
    }
}

function Modify_Seasons(){
    const title = document.getElementById("actual_title").innerHTML;
    let change = document.getElementById("new_seasons").value;
    if (change.length != 0){
        fetch('../series/'+title, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json',
                        Authorization:'Bearer '+localStorage.getItem("token")
                    },
            body: JSON.stringify( {target: 'seasons', change: change} )
        })
        .then(res => SetPageNewT(title))
    }
}