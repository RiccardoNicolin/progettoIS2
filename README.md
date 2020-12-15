# progettoIS2
[![Build Status](https://travis-ci.org/RiccardoNicolin/progettoIS2.svg?branch=main)]https://travis-ci.org/github/RiccardoNicolin/progettoIS2)


How To Demo:
> In Locale:
> > * Clonare la repository git in locale (git clone https://github.com/RiccardoNicolin/progettoIS2.git)
> > * Nella cartella "ProgettoIS2" eseguire il comando "npm install" per installare tutti i moduli necessari al funzionamento dell'applicazione (express, bcrypt, jest, superagent, supertest)
> > * Eseguire il comando "npm start" per avviare l'applicazione: nella console compare il link a "hhtp://localhost:3000/" dove si può vedere l'UI dell'applicazione.
> > * Per eseguire i test segnati nel documento linkato sotto Testing eseguire il comando "npm run test".
> > * Per popolare il database delle serie e utenti standard usare il comando "npm run populate"
> > > Enviroment:
> > > * Se si vuole eseguire il codice in locale è necessario aggiungere un file .env con i dati delle seguenti variabili:
> > > > * DB_URL: url del database
> > > > * JWT_KEY: Chiave di criptazione per generare le chiavi di sessione utente
> > > * Se si vogliono eseguire i test in locale è necessario aggiungere al file .env anche i seguenti dati:
> > > > * DB_TEST1 = database di testing 1
> > > > * DB_TEST2 = database di testing 2
> > > > * DB_TEST3 = database di testing 3
> > > > * DB_TEST4 = database di testing 4
> > > > * TOKEN_TEST = Token di test per utente admin
> > > > * TOKEN_TEST2 = Token di test per utente non admin

> In Heroku
> > Aprire l'applicazione in Heroku seguendi il link "https://secret-retreat-87773.herokuapp.com/"

> DEMO UI
> > * Nella Home Page è presente un input testuale per cercare serie attraverso il nome e filtrare i risultati per tag (Per avvaire la ricerca bisogna premere il bottone "SEARCH", premere invio da tastiera non funziona). 
> > * Premendo il link "REGISTER" si verrà indirizzati a una pagina contenente un form per inserire i propri dati (ogni utente deve avere sia username che email unici).
> > * Nella pagina Home sono presenti dei link alle serie in voga al momento ("hot") o nuove ("new") oltre che le serie seguite dall'utente
> > * Aprendo un link a una serie si viene reindirizzati alla pagina con i dettagli della stessa.
> > * Una volta loggati (esistono già degli utenti predefinit: username: Beppe password: canto, username:Admin password:admin) è possibile aggiungere un voto alle serie e ai singoli episodi premendo i bottoni con un numero (un voto per episodio per ogni utente, se si ripreme il voto verrà modifiato ma non aggiunto come nuovo vuoto)
> > * Premendo "New Comment" comparirà un form per inserire un commento (solo se loggati)
> > * Nelle pagine delle serie è possibile segnarle come "Da vedere" (tasto "Start to track"), in tal caso compariranno nell'homepage e nella pagina della serie si potrà ragiungere il prossimo episodio da vedere.
> > * Nelle pagine degli episodi è possibile muoversi tra l'episodio precedente e il successivo (prev e Next) e segnarli come già visti (solo utenti loggati).
> > * Se loggati come utente con diritti di Amministrazione (user: Admin password:admin) è possibile aggiungere una nuova serie (dalla pagina home), modificare i dettagli di una serie e aggiungerci un episodio(dalla pagina della serie) e modificare i dettagli di un episodio (dalla pagina dell'episodio).
