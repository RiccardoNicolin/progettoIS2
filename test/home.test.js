/**
 * @jest-environment node
 */

const request = require("supertest");
const app = require("../VisualizeAPI/app.js");
const server="/home/";
const serie = require("../DB/serie.js");
//const inizializer = require("../DB/MongoDB.js");

describe("Test on codes on home/", () =>{

    beforeAll(() => {
        //inizializer.inizializeDB();
    });

    test("It should response the GET method affirmatively and return the item", async () => {
        const response = await request(app)
            .get(server)
            .set('Accept', 'application/json' )
            .set({Authorization: 'Bearer 000'});
        expect(response.type).toBe("application/json");

        console.log(response.body);

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

    test("It should response the GET method positively", async() =>{
        const response = await request(app)
            .get(server)
            .set('Authorization', 'Bearer 000');
        expect(response.statusCode).toBe(200);
    });

});