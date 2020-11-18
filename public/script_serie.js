
function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
};

function settaserie(){
    var titolo = getParameterByName('nome');
    fetch('./series/'+titolo)
    .then((res) => res.json())
    .then (json => {
        document.getElementById("titolo").innerHTML += json.nome;
        document.getElementById("attori").innerHTML += json.attori;
        document.getElementById("genere").innerHTML += json.genere;
        document.getElementById("locandina").innerHTML = '<img src='+json.locandina+' style="width:200px;height:200px;">';
        var s = json.stagioni;
        document.getElementById("stagioni").innerHTML += s.toString();

    });
}

settaserie();