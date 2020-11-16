
function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
};

function settaserie(){
    var titolo = getParameterByName('name');
    var testo;
    fetch('http://localhost:3000/series/'+titolo)
    .then((res) => res.json())
    .then (json => {
        //let dati = JSON.parse(json);
        //console.log(dati);
        document.getElementById("titolo").innerHTML += json.nome;
        document.getElementById("attori").innerHTML += json.attori;
        document.getElementById("genere").innerHTML += json.genere;
    });

};

settaserie();