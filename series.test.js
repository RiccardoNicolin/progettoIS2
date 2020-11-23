const request = require("supertest");
const app = require("./VisualizeAPI/app");
const server="/series/";

describe("Test di series/", () => {
    test("It should response the GET method", async () => {
      const response = await request(app)
            .get(server);
        expect(response.statusCode).toBe(200);
    });
});