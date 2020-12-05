
const request = require("supertest");
const app = require("../VisualizeAPI/app.js");
const server="/signup/";
const inizializer = require("../DB/MongoDB.js");
const dotenv = require ('dotenv');
dotenv.config();


/*describe("test on codes in signup/", ()=> {

    beforeAll(async () => {
        //await inizializer.inizializeDB(); 
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