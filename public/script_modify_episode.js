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
    const epnum = getParameterByName('num');
    fetch('../series/'+title+'/'+epnum,{
        method:'GET',
        headers: {
            Authorization: 'Bearer '+localStorage.getItem("token")
        }
    } )
    .then(res => res.json())
    .then (json => {
        console.log(json);
        document.getElementById("actual_name").innerHTML = json.selected.episodeName;
        var s = json.selected.episodeNumber;
        document.getElementById("actual_number").innerHTML = s.toString();
    });
}

function SetPageNewT(title,num){
    fetch('../series/'+title+'/'+num,{
        method:'GET',
        headers: {
            Authorization: 'Bearer '+localStorage.getItem("token")
        }
    } )
    .then(res => res.json())
    .then (json => {
        document.getElementById("actual_name").innerHTML = json.selected.episodeName;
        
        var s = json.selected.episodeNumber;
        document.getElementById("actual_number").innerHTML = s.toString();
    });
}
SetPage();

function Modify_Name(){
    const title = getParameterByName('name');
    const epnum = document.getElementById('actual_number').innerHTML;
    let change = document.getElementById("new_name").value;
    if (change.length != 0){
        fetch('../series/'+title+'/'+epnum, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json',
                        Authorization:'Bearer '+localStorage.getItem("token")
                    },
            body: JSON.stringify( {target: 'episodeName', change: change} )
        }) .then(res => SetPageNewT(title,epnum))
    }
}

function Modify_Number(){
    const title = getParameterByName('name');
    const epnum = document.getElementById('actual_number').innerHTML;
    let change = document.getElementById("new_number").value;
    if (change.length != 0){
        fetch('../series/'+title+'/'+epnum, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json',
                        Authorization:'Bearer '+localStorage.getItem("token")
                    },
            body: JSON.stringify( {target: 'episodeNumber', change: change} )
        }) .then(res => SetPageNewT(title,change))
    }
}