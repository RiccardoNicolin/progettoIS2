var bcrypt = require('bcrypt');

const dati = {
    lista_utenti: [],
    lista_serie: [],
    seguite: []
};

const lista_utenti = {
    insert (utente){
        dati.lista_utenti.push({nome: utente.username, email: utente.email, password: utente.password});
        return;
    },
    cercaPerMail(email){
        return dati.lista_utenti.find(x => x.email == email);
    },
    cercaPerNome(nome){
        return dati.lista_utenti.find(x => x.username == nome);
    },
    tutti(){
        return dati.lista_utenti;
    }
};
// bisogna fixare il push delle serie also
const lista_serie = {
    insert(serie){

        serie.totale=0;
        serie.numerovoti=0;
        serie.commenti = [];
        serie.voto = 0;
        dati.lista_serie.push({
            nome: serie.nome,
            genere : serie.genere,
            attori : serie.attori,
            stagioni : serie.stagioni,
            locandina: serie.locandina,
            totale: serie.totale,
            numerovoti: serie.numerovoti,
            commenti: serie.commenti,
            voto:serie.voto
        });
        return;
    },

    cercaPerNome(nome){
        return dati.lista_serie.find(x => x.nome == nome);
    },



    eliminatag(array, tag){
    var pos= array.indexOf(tag);
    array.slice(pos,pos+1);
    },

    postaCommento(id, commentocompleto){
    let serie = this.cercaPerNome(id);
    serie.commenti.push(commentocompleto);
    },

    modificaCategoria(id, target, modifica){
   let serie = this.cercaPerNome(id);
   console.log(serie);
   serie[target] = modifica;
   console.log(serie);
    },

    modificaVoto(id, vote){
        let serie = this.cercaPerNome(id);
        console.log(serie);
        storage = serie.totale;
        storage = +storage + +vote;
        serie.totale = storage;
        console.log(serie.totale);
        serie.numerovoti = serie.numerovoti + 1;
        console.log(serie.numerovoti);
        serie.voto = (serie.totale / serie.numerovoti).toFixed(2);
    },

    cercaPerGenere(genere){
        return dati.lista_serie.filter(series =>{
            return series.genere == genere;
        });
    },
    
    cercaPerTag(tag) //assolutamente da testare
    {
        function cercaTag(item)
        {
            return item.genere.includes(tag);
        };

        return dati.lista_serie.filter(cercaTag);
    },

    tutti(){
        return dati.lista_serie;
    },

    mostravoto(id){
        return dati.lista_serie.id.voto;
    }
};

const seguite = {
    insert(seg){
        dati.seguite.push(seg);
        return;
    },
    ricercaUtente(persona){
        return dati.seguite.filter( x => x.utente.email == persona.email);
    }
}
/*
copiare schema seguite per guardate
*/

/*
2 UTENTI:
utente1 usr:Prova passw:prova mail:standard@gmail.com
utente2 usr:Beppe passw: canto mail: beppe@gmail.com
2 SERIE
Firefly nome: Firefly   genere :SCI_FI, Avventura    attori: Nathan Fillion     Stagioni : 1
Brek  nome : Breaking Bad   genere: Drammatico Thriller     attori: Bryan Cranston, Aaron Paul    Stagioni: 5
utente1 segue firefly
utente2 segue firefly e brek
*/

var utente1 = {
    username: "Admin",
    password: "QQQ",
    email : "admin@mail.com"
}

var utente2 = {
    username: "Beppe",
    password: bcrypt.hash("canto", 10),
    email : "beppe@mail.com"
}

var Firefly = {
    nome: "Firefly",
    genere : ["SCI_FI", "Avventura", "hot"],
    attori : ["Nathan Fillion"],
    stagioni : 1,
    locandina: "https://upload.wikimedia.org/wikipedia/it/thumb/a/af/Fireflyopeninglogo.JPG/260px-Fireflyopeninglogo.JPG"
}

var Brek = {
    nome : "Breaking Bad",
    genere: ["Drammatico", "Thriller", "new"],
    attori: ["Bryan Cranston", "Aaron Paul"],
    stagioni: 5,
    locandina: "https://upload.wikimedia.org/wikipedia/it/b/b8/Breaking_Bad_Pilot_logo.png",
}

lista_utenti.insert(utente1);
lista_utenti.insert(utente2);
lista_serie.insert(Firefly);
lista_serie.insert(Brek);
seguite.insert(
    {
        utente: utente1,
        serie: Firefly
    });

seguite.insert(
    {
         utente: utente2,
        serie: Firefly
    });


seguite.insert(
    {
        utente: utente2,
        serie: Brek
    });



module.exports = {
    lista_serie,
    lista_utenti,
    seguite
}