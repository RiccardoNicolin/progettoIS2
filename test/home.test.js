const request = require("supertest");
const app = require("../VisualizeAPI/app.js");
const server="/home/";

describe("Test on codes on home/", () =>{

    test("It should response the GET method affirmatively and return the item", async () => {
        const response = await request(app)
            .get(server)
            .set('Accept', 'application/json');
        expect(response.type).toBe("application/json");
        
        //assolutamente da cambiare, qui il check è fatto manualmente, se aggiungiamo serie in hot o new crea errore in test
        expect(response.body).toStrictEqual({
            serieshot: [        
              {
                nome: 'Firefly',
                genere: ["SCI_FI", "Avventura", "hot"],
                attori: ["Nathan Fillion"],
                stagioni: 1,    
                locandina: 'https://upload.wikimedia.org/wikipedia/it/thumb/a/af/Fireflyopeninglogo.JPG/260px-Fireflyopeninglogo.JPG',
                totale: 0,
                numerovoti: 0,
                commenti: [],
                voto: 0
              }
            ],
            seriesnew: [
              {
                nome: 'Breaking Bad',
                genere: ["Drammatico", "Thriller", "new"],
                attori: ["Bryan Cranston", "Aaron Paul"],
                stagioni: 5,
                locandina: 'https://upload.wikimedia.org/wikipedia/it/b/b8/Breaking_Bad_Pilot_logo.png',
                totale: 0,
                numerovoti: 0,
                commenti: [],
                voto: 0
              }
            ]
          });
    });

    test("It should response the GET method positively", async() =>{
        const response = await request(app)
            .get(server)
        expect(response.statusCode).toBe(200);
    });

});