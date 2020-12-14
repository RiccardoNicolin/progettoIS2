/**
 * @jest-environment node
 */

const request = require("supertest");
const app = require("../VisualizeAPI/app.js");
const server="/home/";
const serie = require("../DB/serie.js");
const user = require("../DB/user");
const inizializer = require("../DB/InizializeDB");
const mongoose = require('mongoose');
require('dotenv').config();

describe("Test on codes on home/", () =>{

    beforeAll(async () => {

        await mongoose.connect(process.env.DB_TEST1, {useNewUrlParser: true, useUnifiedTopology: true});

        await inizializer.init();
    });

    afterAll(async () =>{
        await mongoose.connection.close();
    });


    test("It should respose the get method negativley because the url is not valid", async () => {
        const response = await request(app)
            .get("/inesistente")
            .set('Accept', 'application/json' )
        expect(response.statusCode).toBe(404);

    });

    test("It should response the GET method affirmatively and return the item with token 000", async () => {
        const response = await request(app)
            .get(server)
            .set('Accept', 'application/json' )
            .set({Authorization: 'Bearer 000'});
        expect(response.type).toBe("application/json");

        let res=response.body;
        
        let requested = {
            serieshot: res.serieshot,
            seriesnew: res.seriesnew
        };
        
        requested=JSON.stringify(requested);

        let expectiong = {
            serieshot: await serie.findMore('tag', "hot"),
            seriesnew: await serie.findMore('tag', 'new')
        };

        expectiong=JSON.stringify(expectiong);
        //assolutamente da cambiare, qui il check è fatto manualmente, se aggiungiamo serie in hot o new crea errore in test
        expect(requested).toBe( expectiong );
    });

    test("It should response the GET method affirmatively and return the item with invalid token", async () => {
        const response = await request(app)
            .get(server)
            .set('Accept', 'application/json' )
            .set({Authorization: 'Bearer invalid'});
        expect(response.type).toBe("application/json");

        let res=response.body;
        
        let requested = {
            serieshot: res.serieshot,
            seriesnew: res.seriesnew
        };
        
        requested=JSON.stringify(requested);

        let expectiong = {
            serieshot: await serie.findMore('tag', "hot"),
            seriesnew: await serie.findMore('tag', 'new')
        };

        expectiong=JSON.stringify(expectiong);
        //assolutamente da cambiare, qui il check è fatto manualmente, se aggiungiamo serie in hot o new crea errore in test
        expect(requested).toBe( expectiong );
    });

    test("It should response the GET method affirmatively and return the item with admin token", async () => {
        const response = await request(app)
            .get(server)
            .set('Accept', 'application/json' )
            .set({Authorization: 'Bearer '+process.env.TOKEN_TEST});
        expect(response.type).toBe("application/json");

        let res=response.body;
        
        let requested = {
            serieshot: res.serieshot,
            seriesnew: res.seriesnew,
            serieswatched: res.serieswatched
        };
        
        requested=JSON.stringify(requested);

        let expectiong = {
            serieshot: await serie.findMore('tag', "hot"),
            seriesnew: await serie.findMore('tag', 'new'),
            serieswatched: await user.findAllWatched("testuser")
        };

        expectiong=JSON.stringify(expectiong);
        //assolutamente da cambiare, qui il check è fatto manualmente, se aggiungiamo serie in hot o new crea errore in test
        expect(requested).toBe( expectiong );
    });

    test("It should response the GET method affirmatively and return the item with user token", async () => {
        const response = await request(app)
            .get(server)
            .set('Accept', 'application/json' )
            .set({Authorization: 'Bearer '+process.env.TOKEN_TEST2});
        expect(response.type).toBe("application/json");

        let res=response.body;
        
        let requested = {
            serieshot: res.serieshot,
            seriesnew: res.seriesnew,
        };
        
        requested=JSON.stringify(requested);

        let expectiong = {
            serieshot: await serie.findMore('tag', "hot"),
            seriesnew: await serie.findMore('tag', 'new'),
        };

        expectiong=JSON.stringify(expectiong);
        //assolutamente da cambiare, qui il check è fatto manualmente, se aggiungiamo serie in hot o new crea errore in test
        expect(requested).toBe( expectiong );
    });

    test("It should response the GET method positively", async() =>{
        const response = await request(app)
            .get(server)
            .set('Authorization', 'Bearer 000');
        expect(response.statusCode).toBe(200);
    });

});