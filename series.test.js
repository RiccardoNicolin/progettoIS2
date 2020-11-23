const request = require("supertest");
const app = require("./VisualizeAPI/app");
const server="/series/";

describe("Test dei codici series/", () => {
    test("It should response the GET method affirmatively", async () => {
      const response = await request(app)
            .get(server);
        expect(response.statusCode).toBe(200);
    });

    test("It should response the POST method affirmatively", async() =>{
        const response = await request(app)
            .post(server)
            .send({
                nome : "Black Lightning",
                genere: ["Supereroi", "Azione", "hot"],
                attori: ["Cress Williams", "China Anne McClain"],
                stagioni: 3,
                locandina: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Black_Lightning_logo_recreaci%C3%B3n_%28cropped%29.png/260px-Black_Lightning_logo_recreaci%C3%B3n_%28cropped%29.png",
            })
            .set('Accept', 'application/json');
        expect(response.statusCode).toBe(201);
    });

    test("It should response the POST method negatively", async() =>{
        const response = await request(app)
            .post(server)
            .send({
                nome : "",
            })
            .set('Accept', 'application/json');
        expect(response.statusCode).toBe(500);
    });
});

describe("test sui contenuti series/", () => {

    

});

