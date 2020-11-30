/**
 * @jest-environment node
 */

const request = require("supertest");
const app = require("../VisualizeAPI/app.js");
const server="/home/";
const serie = require("../DB/serie.js");
const inizializer = require("../DB/MongoDB.js");

describe("Test on codes on home/", () =>{

    beforeAll(() => {
        inizializer.inizializeDB();
    });

    test("It should response the GET method affirmatively and return the item", async () => {
        const response = await request(app)
            .get(server)
            .set('Accept', 'application/json');
        expect(response.type).toBe("application/json");
        
        //assolutamente da cambiare, qui il check è fatto manualmente, se aggiungiamo serie in hot o new crea errore in test
        expect(response.body).toStrictEqual([
            serie.findMore('tag', "hot"),
            serie.findMore('tag', 'new')
        ]);
    });

    test("It should response the GET method positively", async() =>{
        const response = await request(app)
            .get(server)
        expect(response.statusCode).toBe(200);
    });

});