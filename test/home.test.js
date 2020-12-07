
const request = require("supertest");
const app = require("../VisualizeAPI/app.js");
const server="/home";
const serie = require("../DB/serie.js");
const inizializer = require("../DB/MongoDB.js");
const dotenv = require ('dotenv');
dotenv.config();


describe("Test on codes on home/", () =>{

    beforeAll(async () => {
        //await inizializer.inizializeDB(); 
     });

    test("It should response the GET method affirmatively and return the item", async () => {
        const response = await request(app)
            .get(server)
            .set('Accept', 'application/json');
        expect(response.type).toBe("application/json");

        let hot = await serie.findMore('tag', "hot");
        let seriesnew= await serie.findMore('tag', "new");

        let completo = {
            serieshot: hot,
            seriesnew: seriesnew
        };

        expect(response.statusCode).toBe(200);
    });

    test("It should response the GET method positively", async() =>{
        const response = await request(app)
            .get(server)
        expect(response.statusCode).toBe(200);
    });

});