/**
 * @jest-environment node
 */

const request = require("supertest");
const app = require("../VisualizeAPI/app.js");
const server="/series/";
const serie = require("../DB/serie.js")
const inizializer = require("../DB/InizializeDB");
const mongoose = require('mongoose');
require('dotenv').config();

describe("Test on codes in series/ ", () => {

    beforeAll(async () => {

        await mongoose.connect(process.env.DB_TEST3, {useNewUrlParser: true, useUnifiedTopology: true});

        await inizializer.init();
    });

    afterAll(async () =>{
        await mongoose.connection.close();
    });

    test("It should response the GET method affirmatively with token 000", async () => {
      const response = await request(app)
            .get(server)
            .set({Authorization: 'Bearer 000'});
        expect(response.statusCode).toBe(200);
    });

    test("It should response the GET method affirmatively with admin token", async () => {
        const response = await request(app)
              .get(server)
              .set({Authorization: 'Bearer '+process.env.TOKEN_TEST});
          expect(response.statusCode).toBe(200);
    });

    test("It should response the GET method affirmatively without token", async () => {
        const response = await request(app)
              .get(server)
              .set({Authorization: 'Bearer invalido'});
          expect(response.statusCode).toBe(200);
    });

    test("It should response the POST method affirmatively", async() =>{
        const response = await request(app)
            .post(server)
            .send({
                name : "Black Lightning",
                genre: ["Supereroi", "Azione"],
                tag: ["hot"],
                actors: ["Cress Williams", "China Anne McClain"],
                seasons: 3,
                poster: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Black_Lightning_logo_recreaci%C3%B3n_%28cropped%29.png/260px-Black_Lightning_logo_recreaci%C3%B3n_%28cropped%29.png",
            })
            .set('Accept', 'application/json')
            .set({Authorization: 'Bearer '+process.env.TOKEN_TEST});
        expect(response.statusCode).toBe(201);
    });

    test("It should response the POST method negatively without name field", async() =>{
        const response = await request(app)
            .post(server)
            .send({
                name : "",
            })
            .set('Accept', 'application/json')
            .set({Authorization: 'Bearer '+process.env.TOKEN_TEST});
        expect(response.statusCode).toBe(500);
    });

    test("It should response the POST method negatively without admin priviledge", async() =>{
        const response = await request(app)
            .post(server)
            .send({
                name : "Black Lightning",
                genre: ["Supereroi", "Azione"],
                tag: ["hot"],
                actors: ["Cress Williams", "China Anne McClain"],
                seasons: 3,
                poster: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Black_Lightning_logo_recreaci%C3%B3n_%28cropped%29.png/260px-Black_Lightning_logo_recreaci%C3%B3n_%28cropped%29.png",
            })
            .set('Accept', 'application/json')
            .set({Authorization: '000'});
        expect(response.statusCode).toBe(401);
    });
});

describe("test on content series/name", () => {

    beforeAll(async () => {

        await mongoose.connect(process.env.DB_TEST3, {useNewUrlParser: true, useUnifiedTopology: true});

        await inizializer.init();
    });

    afterAll(async () =>{
        await mongoose.connection.close();
    });


    test("It should response the GET method affirmatively and return the item with admin token", async () => {
        const response = await request(app)
            .get(server+"Firefly")
            .set('Accept', 'application/json')
            .set({Authorization: 'Bearer '+process.env.TOKEN_TEST});
        expect(response.type).toBe("application/json");

        let res=  JSON.stringify(response.body.selected);
        
        let query = await serie.get("Firefly");

        let test = JSON.stringify(query);

        expect(test).toBe(res);
    });

    test("It should response the GET method affirmatively and return the item with 000 token", async () => {
        const response = await request(app)
            .get(server+"Firefly")
            .set('Accept', 'application/json')
            .set({Authorization: 'Bearer 000'});
        expect(response.type).toBe("application/json");

        let res=  JSON.stringify(response.body.selected);
        
        let query = await serie.get("Firefly");

        let test = JSON.stringify(query);

        expect(test).toBe(res);
    });

    test("It should response the GET method affirmatively and return the item with invalid token", async () => {
        const response = await request(app)
            .get(server+"Firefly")
            .set('Accept', 'application/json')
            .set({Authorization: 'Bearer invalid'});
        expect(response.type).toBe("application/json");

        let res=  JSON.stringify(response.body.selected);
        
        let query = await serie.get("Firefly");

        let test = JSON.stringify(query);

        expect(test).toBe(res);
    });

    test("It should response the GET method negatively with token 000", async () => {
        const response = await request(app)
            .get(server+" boh")
            .set('Accept', 'application/json')
            .set({Authorization: 'Bearer 000'});

        expect(response.statusCode).toBe(404);
    });

    test("It should response the GET method negatively with invalid token", async () => {
        const response = await request(app)
            .get(server+"boh")
            .set('Accept', 'application/json')
            .set({Authorization: 'Bearer invalid'});

        expect(response.statusCode).toBe(404);
    });


    test("It should response the POST method to add comment affirmatively", async () => {
        const response = await request(app)
            .post(server+"Firefly")
            .send({
                name: "Firefly",
                poster: "Gianfrantonio",
                comment: "a me me piace nutella"
            })
            .set({Authorization: 'Bearer '+process.env.TOKEN_TEST});

        expect(response.statusCode).toBe(201);
    });

    test("It should response the POST method to add comment affirmatively for adding to watched 1", async () => {
        const response = await request(app)
            .post(server+"Firefly")
            .send({
                watchednum: 2
            })
            .set({Authorization: 'Bearer '+process.env.TOKEN_TEST});

        expect(response.statusCode).toBe(201);
    });

    test("It should response the POST method to add comment affirmatively for adding to watched 2", async () => {
        const response = await request(app)
            .post(server+"Breaking Bad ")
            .send({
                watchednum: 4
            })
            .set({Authorization: 'Bearer '+process.env.TOKEN_TEST});

        expect(response.statusCode).toBe(201);
    });

    test("It should response the POST method to add comment affirmatively for adding to watched 3", async () => {
        const response = await request(app)
            .post(server+"Breaking Bad ")
            .send({
                watchednum: 5
            })
            .set({Authorization: 'Bearer '+process.env.TOKEN_TEST});

        expect(response.statusCode).toBe(201);
    });

    test("It should response the POST method to add comment negatively bacause no comment body", async () => {
        const response = await request(app)
            .post(server+"Firefly")
            .send({
                comment: ""
            })
            .set({Authorization: 'Bearer '+process.env.TOKEN_TEST});
        expect(response.statusCode).toBe(500);
    });

    test("It should response the POST method to add comment negatively because no token", async () => {
        const response = await request(app)
            .post(server+"Firefly")
            .send({
                comment: "b"
            })
            .set({Authorization: ""});
        expect(response.statusCode).toBe(401);
    });
    test("It should response the POST method to add comment negatively because invalid token", async () => {
        const response = await request(app)
            .post(server+"Firefly")
            .send({
                comment: "c"
            })
            .set({Authorization: 'Bearer '+"invalid"});
        expect(response.statusCode).toBe(401);
    });

    test("It should response the POST method to add comment negatively because token is without admin priviledges", async () => {
        const response = await request(app)
            .post(server+"Firefly")
            .send({
                comment: "d"
            })
            .set({Authorization: 'Bearer 000'});
        expect(response.statusCode).toBe(401);
    });

    test("It should response the POST method to add episode positively with admin token", async () => {
        const response = await request(app)
            .post(server+"Firefly")
            .send({
                episodeName: "Il cielo è arancione",
                episodeNumber: "4"
            })
            .set({Authorization: 'Bearer '+ process.env.TOKEN_TEST});
        expect(response.statusCode).toBe(201);
    });

    test("It should response the POST method to add episode negatively because no admin token", async () => {
        const response = await request(app)
            .post(server+"Firefly")
            .send({
                episodeName: "Il cielo è arancione",
                episodeNumber: "4"
            })
            .set({Authorization: 'Bearer 000'});
        expect(response.statusCode).toBe(401);
    });

    test("It should response the POST method to add episode negatively because missing fields", async () => {
        const response = await request(app)
            .post(server+"Firefly")
            .send({
                episodeName: "Il cielo è arancione"
            })
            .set({Authorization: 'Bearer '+ process.env.TOKEN_TEST});
        expect(response.statusCode).toBe(500);
    });

    test("It should response the POST method to add episode negatively because duplicate EpisodeNumber", async () => {
        const response = await request(app)
            .post(server+"Firefly")
            .send({
                episodeName: "Il cielo è arancionicchio",
                episodeNumber: "4"
            })
            .set({Authorization: 'Bearer '+ process.env.TOKEN_TEST});
        expect(response.statusCode).toBe(403);
    });

    test("It should response the PATCH method affirmatively for adding votes", async () => {
        const response = await request(app)
            .patch(server+"Firefly")
            .send({
                score: 8
            })
            .set({Authorization: 'Bearer '+process.env.TOKEN_TEST});

        expect(response.statusCode).toBe(200);
    });

    test("It should response the PATCH method affirmatively for changing votes", async () => {
        const response = await request(app)
            .patch(server+"Firefly")
            .send({
                score: 9
            })
            .set({Authorization: 'Bearer '+process.env.TOKEN_TEST});

        expect(response.statusCode).toBe(200);
    });

    test("It should response the PATCH method affirmatively for changing tag", async () => {
        const response = await request(app)
            .patch(server+"Firefly")
            .send({
                target: "seasons",
                change: "2"
            })
            .set({Authorization: 'Bearer '+process.env.TOKEN_TEST});

        expect(response.statusCode).toBe(200);
    });

    test("It should response the PATCH method negatively", async () => {
        const response = await request(app)
            .patch(server+"Firefly")
            .send({
                target: "",
                change: "6"
            })
            .set({Authorization: 'Bearer '+process.env.TOKEN_TEST});
        expect(response.statusCode).toBe(500);
    });

    
});

describe("test on content series/name/episodeNumber", () => {

    beforeAll(async () => {

        await mongoose.connect(process.env.DB_TEST3, {useNewUrlParser: true, useUnifiedTopology: true});

        await inizializer.init();
    });

    afterAll(async () =>{
        await mongoose.connection.close();
    });

    test("It should response the GET method affirmatively and return the item with admin token", async () => {
        const response = await request(app)
            .get(server+"Firefly/2")
            .set('Accept', 'application/json')
            .set({Authorization: 'Bearer '+process.env.TOKEN_TEST});
        expect(response.type).toBe("application/json");

        res=response.body.selected;

        res=JSON.stringify(res);

        test=await serie.getEpisode("Firefly", 2);

        test=JSON.stringify(test);

        expect(response.statusCode).toBe(200);

        expect(test).toBe(res);
    });

    test("It should response the GET method affirmatively and return the item with token 000", async () => {
        const response = await request(app)
            .get(server+"Firefly/1")
            .set('Accept', 'application/json')
            .set({Authorization: 'Bearer 000'});
        expect(response.type).toBe("application/json");

        res=response.body.selected;

        res=JSON.stringify(res);

        test=await serie.getEpisode("Firefly", 1);

        test=JSON.stringify(test);

        expect(response.statusCode).toBe(200);

        expect(test).toBe(res);
    });

    test("It should response the GET method affirmatively and return the item with token invalid", async () => {
        const response = await request(app)
            .get(server+"Firefly/3")
            .set('Accept', 'application/json')
            .set({Authorization: 'Bearer invalid'});
        expect(response.type).toBe("application/json");

        res=response.body.selected;

        res=JSON.stringify(res);

        test=await serie.getEpisode("Firefly", 3);

        test=JSON.stringify(test);

        expect(response.statusCode).toBe(200);

        expect(test).toBe(res);
    });

    test("It should response the GET method negatively with admin token", async () => {
        const response = await request(app)
            .get(server+"Firefly/1000")
            .set('Accept', 'application/json')
            .set({Authorization: 'Bearer '+process.env.TOKEN_TEST});
        expect(response.type).toBe("application/json");

        expect(response.statusCode).toBe(404);
    });

    test("It should response the GET method negatively with token 000", async () => {
        const response = await request(app)
            .get(server+"Firefly/1000")
            .set('Accept', 'application/json')
            .set({Authorization: 'Bearer 000'});
        expect(response.type).toBe("application/json");

        expect(response.statusCode).toBe(404);
    });

    test("It should response the GET method negatively with token invalid", async () => {
        const response = await request(app)
            .get(server+"Firefly/1000")
            .set('Accept', 'application/json')
            .set({Authorization: 'Bearer invalid'});
        expect(response.type).toBe("application/json");

        expect(response.statusCode).toBe(404);
    });

    test("It should response the POST method to store watched positively with admin token", async () => {
        const response = await request(app)
            .post(server+"Firefly/3")
            .send({
                watchupdate : 2
            })
            .set('Accept', 'application/json')
            .set({Authorization: 'Bearer '+process.env.TOKEN_TEST});
        expect(response.type).toBe("application/json");

        expect(response.statusCode).toBe(201);
    });

    test("It should response the POST method to store comments positively with admin token", async () => {
        const response = await request(app)
            .post(server+"Firefly/3")
            .send({
                comment : "l'episodio è brutto"
            })
            .set('Accept', 'application/json')
            .set({Authorization: 'Bearer '+process.env.TOKEN_TEST});
        expect(response.type).toBe("application/json");

        expect(response.statusCode).toBe(201);
    });

    test("It should response the POST method negatively with admin token because no parameter", async () => {
        const response = await request(app)
            .post(server+"Firefly/3")
            .send({
            })
            .set('Accept', 'application/json')
            .set({Authorization: 'Bearer '+process.env.TOKEN_TEST});
        expect(response.type).toBe("application/json");

        expect(response.statusCode).toBe(500);
    });

    test("It should response the PATCH method positively to add a score with admin token", async () => {
        const response = await request(app)
            .patch(server+"Firefly/3")
            .send({
                score: 5
            })
            .set('Accept', 'application/json')
            .set({Authorization: 'Bearer '+process.env.TOKEN_TEST});
        expect(response.type).toBe("application/json");

        expect(response.statusCode).toBe(200);
    });

    test("It should response the PATCH method positively to modify a score with admin token", async () => {
        const response = await request(app)
            .patch(server+"Firefly/3")
            .send({
                score: 5
            })
            .set('Accept', 'application/json')
            .set({Authorization: 'Bearer '+process.env.TOKEN_TEST});
        expect(response.type).toBe("application/json");

        expect(response.statusCode).toBe(200);
    });

    test("It should response the PATCH method positively to modify the name of an episode with admin token", async () => {
        const response = await request(app)
            .patch(server+"Firefly/3")
            .send({
                target: "episodeName",
                change: "il cielo è violetto"
            })
            .set('Accept', 'application/json')
            .set({Authorization: 'Bearer '+process.env.TOKEN_TEST});
        expect(response.type).toBe("application/json");

        expect(response.statusCode).toBe(200);
    });

    test("It should response the PATCH method positively to modify the number of an episode with admin token", async () => {
        const response = await request(app)
            .patch(server+"Firefly/3")
            .send({
                target: "episodeNumber",
                change: 5
            })
            .set('Accept', 'application/json')
            .set({Authorization: 'Bearer '+process.env.TOKEN_TEST});
        expect(response.type).toBe("application/json");

        expect(response.statusCode).toBe(200);
    });

    test("It should response the PATCH method negatively to modify the name of an episode because no admin token", async () => {
        const response = await request(app)
            .patch(server+"Firefly/3")
            .send({
                target: "episodeName",
                change: "il cielo è violetto"
            })
            .set('Accept', 'application/json')
            .set({Authorization: 'Bearer invalid'});
        expect(response.type).toBe("application/json");

        expect(response.statusCode).toBe(401);
    });

    test("It should response the PATCH method negatively to modify the comments of an episode with admin token because the field is invalid", async () => {
        const response = await request(app)
            .patch(server+"Firefly/3")
            .send({
                target: "comments",
                change: "tutti i commenti sono bannati"
            })
            .set('Accept', 'application/json')
            .set({Authorization: 'Bearer '+process.env.TOKEN_TEST});
        expect(response.type).toBe("application/json");

        expect(response.statusCode).toBe(422);
    });

    test("It should response the PATCH method negatively to modify an episode because no parameter", async () => {
        const response = await request(app)
            .patch(server+"Firefly/3")
            .send({
            })
            .set('Accept', 'application/json')
            .set({Authorization: 'Bearer '+process.env.TOKEN_TEST});
        expect(response.type).toBe("application/json");

        expect(response.statusCode).toBe(500);
    });
});