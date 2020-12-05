const request = require("supertest");
const app = require("../VisualizeAPI/app.js");
const server="/series/";
const serie = require("../DB/serie.js")
const inizializer = require("../DB/MongoDB.js");
const mongoose = require ('mongoose');
const dotenv = require ('dotenv');
dotenv.config();

/*describe("Test on codes in series/ ", () => {

    beforeAll(async () => {
        //await inizializer.inizializeDB(); 
     });

    test("It should response the GET method affirmatively", async () => {
      const response = await request(app)
            .get(server);
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
            .set('Accept', 'application/json');
        expect(response.statusCode).toBe(201);
    });

    test("It should response the POST method negatively", async() =>{
        const response = await request(app)
            .post(server)
            .send({
                name : "",
            })
            .set('Accept', 'application/json');
        expect(response.statusCode).toBe(500);
    });
});*/

describe("test on content series/name", () => {

    beforeAll(async () => {
        //await inizializer.inizializeDB(); 
     });

    test("It should response the GET method affirmatively and return the item", async () => {
        const response = await request(app)
            .get(server+"Firefly")
            .set('Accept', 'application/json');
        
        expect(response.type).toBe("application/json");

        let testBody=response.body.selected;

        let expected = await serie.get("Firefly");

        expect(testBody).toStrictEqual(
            expected
        );
    });

    test("It should response the POST method affirmatively", async () => {
        const response = await request(app)
            .post(server+"Firefly")
            .send({
                name: "Firefly",
                poster: "Gianfrantonio",
                comment: "a me me piace nutella"
            });
        expect(response.statusCode).toBe(201);
    });

    test("It should response the POST method negatively", async () => {
        const response = await request(app)
            .post(server+"Firefly")
            .send({
                name: "",
                poster: "",
                comment: "a me me piace nutella"
            });
        expect(response.statusCode).toBe(500);
    });

    test("It should response the PATCH method affirmatively for changing votes", async () => {
        const response = await request(app)
            .patch(server+"Firefly")
            .send({
                score: 8
            });
        expect(response.statusCode).toBe(200);
    });

    test("It should response the PATCH method affirmatively for changing tag", async () => {
        const response = await request(app)
            .patch(server+"Firefly")
            .send({
                target: "seasons",
                change: "2"
            });
        expect(response.statusCode).toBe(200);
    });

    test("It should response the PATCH method negatively", async () => {
        const response = await request(app)
            .patch(server+"Firefly")
            .send({
                target: "",
                change: "6"
            });
        expect(response.statusCode).toBe(500);
    });
});