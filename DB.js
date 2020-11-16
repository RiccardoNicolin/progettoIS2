const dati = {
    lista_utenti: [],
    lista_serie: [],
    seguite: []
};

const lista_utenti = {
    insert (utente){
        dati.lista_utenti.push({nome: utente.nome, email: utente.email, password: utente.password});
        return;
    },
    cercaPerMail(email){
        return dati.lista_utenti.find(x => x.email == email);
    },
    cercaPerNome(nome){
        return dati.lista_utenti.find(x => x.nome == nome);
    },
    tutti(){
        return dati.lista_utenti;
    }
};
// bisogna fixare il push delle serie also
const lista_serie = {
    insert(serie){
        dati.lista_serie.push({
            nome: serie.nome,
            genere : serie.genere,
            attori : serie.attori,
            stagioni : serie.stagioni,
            hot: serie.hot
        });
        return;
    },

    cercaPerNome(nome){
        return dati.lista_serie.find(x => x.nome = nome);
    },

    ishot(value){
        return value == 1;
    },
    
    cercaSeHot(hot) {
        return dati.lista_serie.filter(obj => obj.hot == hot);
      },

  /*  cercaPerGenere(genere){
        return dati.lista_serie.map(x => x.genere);

         .map( (serie) => {
            return {
                self: '/series/' + serie.nome,
                title: serie.nome
            };
        });
    },*/
    

    tutti(){
        return dati.lista_serie;
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
    password: "Password",
    email : "admin@mail.com"
}

var utente2 = {
    username: "Beppe",
    password: "canto",
    mail : "beppe@mail.com"
}

var Firefly = {
    nome: "Firefly",
    genere : ["SCI_FI", "Avventura", "hot"],
    attori : ["Nathan Fillion"],
    stagioni : 1,
    hot: 1
}

var Brek = {
    nome : "Breaking Bad",
    genere: ["Drammatico", "Thriller"],
    attori: ["Bryan Cranston", "Aaron Paul"],
    stagioni: 5,
    hot: 0
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