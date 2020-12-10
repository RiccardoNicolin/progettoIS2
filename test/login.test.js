/**
 * @jest-environment node
 */

const request = require("supertest");
const app = require("../VisualizeAPI/app.js");
const server="/login/";
const serie = require("../DB/serie.js")
const inizializer = require("../DB/InizializeDB");
const mongoose = require('mongoose');
require('dotenv').config();

describe("Test on codes in login/ ", () => {

    beforeAll(async () => {

        await mongoose.connect(process.env.DB_TEST4, {useNewUrlParser: true, useUnifiedTopology: true});

        await inizializer.init();
    });

    afterAll(async () =>{
        await mongoose.connection.close();
    });

    test("It should response the POST method affirmatively and return the token", async() =>{
        const response = await request(app)
            .post(server)
            .send({
                username : "testuser",
                password: "testuser"
            })
            .set('Accept', 'application/json')
            .set({Authorization: 'Bearer 000'});
        expect(response.statusCode).toBe(201);
        expect(response.body.token).toBeTruthy();
    });

    test("It should response the POST method negatively because wrong password", async() =>{
        const response = await request(app)
            .post(server)
            .send({
                username : "testuser",
                password: "sbagliata"
            })
            .set('Accept', 'application/json')
            .set({Authorization: 'Bearer 000'});
        expect(response.statusCode).toBe(401);
    });

    test("It should response the POST method negatively because user not found", async() =>{
        const response = await request(app)
            .post(server)
            .send({
                username : "tagliatella",
            })
            .set('Accept', 'application/json')
            .set({Authorization: 'Bearer 000'});
        expect(response.statusCode).toBe(401);
    });

});