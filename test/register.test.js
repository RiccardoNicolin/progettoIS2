/**
 * @jest-environment node
 */

const request = require("supertest");
const app = require("../VisualizeAPI/app.js");
const server="/signup/";
/*describe("test on codes in signup/", ()=> {

    beforeAll(() => {
        inizializer.inizializeDB();
    });

    test("It should response the POST method affirmatively", async() =>{
        const response = await request(app)
            .post(server)
            .send({
                username : "Ettore",
                email: "ettore.carbone@studenti.unitn.it",
                password: "nonLaDico"
            })
            .set('Accept', 'application/json');
        expect(response.statusCode).toBe(201);
    });

    test("It should response the POST method negatively", async() =>{
        const response = await request(app)
            .post(server)
            .send({
                username : "Ettore",
                email: "ettore.carbone@studenti.unitn.it",
                password: "nonLaDico"
            })
            .set('Accept', 'application/json');
        expect(response.statusCode).toBe(500);
    });
});*/