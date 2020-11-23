const request = require("supertest");
const app = require("./VisualizeAPI/app");
const server="/series/";

describe("Test dei codici series/ ", () => {
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

describe("test sui contenuti series/nome", () => {

    test("It should response the GET method affirmatively and return the item", async () => {
        const response = await request(app)
            .get(server+"/Firefly")
            .set('Accept', 'application/json');
        expect(response.type).toBe("application/json");

        let testBody={
            nome: response.body.serie.nome,
            genere: response.body.serie.genere,
            attori: response.body.serie.attori,
            stagioni: response.body.serie.stagioni,
            locandina: response.body.serie.locandina
        }
        expect(testBody).toStrictEqual({
            nome: "Firefly",
            genere : ["SCI_FI", "Avventura", "hot"],
            attori : ["Nathan Fillion"],
            stagioni : 1,
            locandina: "https://upload.wikimedia.org/wikipedia/it/thumb/a/af/Fireflyopeninglogo.JPG/260px-Fireflyopeninglogo.JPG"
        });
    });

    test("It should response the POST method affirmatively", async () => {
        const response = await request(app)
            .post(server+"/Firefly")
            .send({
                nome: "Firefly",
                poster: "Gianfrantonio",
                comment: "a me me piace nutella"
            });
        expect(response.statusCode).toBe(201);
    });

    test("It should response the POST method negatively", async () => {
        const response = await request(app)
            .post(server+"/Firefly")
            .send({
                nome: "",
                poster: "",
                comment: "a me me piace nutella"
            });
        expect(response.statusCode).toBe(500);
    });

    test("It should response the PATCH method affirmatively for changing votes", async () => {
        const response = await request(app)
            .patch(server+"/Firefly")
            .send({
                vote: 8
            });
        expect(response.statusCode).toBe(200);
    });

    test("It should response the PATCH method affirmatively for changing tag", async () => {
        const response = await request(app)
            .patch(server+"/Firefly")
            .send({
                target: "stagioni",
                change: "2"
            });
        expect(response.statusCode).toBe(200);
    });
});

