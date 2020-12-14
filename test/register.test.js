/**
 * @jest-environment node
 */

const request = require("supertest");
const app = require("../VisualizeAPI/app.js");
const server="/signup/";
const inizializer = require("../DB/InizializeDB");
const mongoose = require('mongoose');
require('dotenv').config();

describe("test on codes in signup/", ()=> {

    beforeAll(async () => {

        await mongoose.connect(process.env.DB_TEST2, {useNewUrlParser: true, useUnifiedTopology: true});

        await inizializer.init();
    });

    afterAll(async () =>{
        await mongoose.connection.close();
    });


    test("It should response the POST method affirmatively", async() =>{
        const response = await request(app)
            .post(server)
            .send({
                username : "Ettore",
                email: "ettore.pazzouomo@test.it",
                password: "nonLaDico"
            })
            .set('Accept', 'application/json')
            .set({Authorization: 'Bearer 000'});
        expect(response.statusCode).toBe(201);
    });

    test("It should response the POST method negatively because duplicated user", async() =>{
        const response = await request(app)
            .post(server)
            .send({
                username : "Ettore",
                email: "ettore.pazzouomo@test.it",
                password: "nonLaDico"
            })
            .set('Accept', 'application/json')
            .set({Authorization: 'Bearer 000'});
        expect(response.statusCode).toBe(500);
    });

    test("It should response the POST method negatively because missing parameters", async() =>{
        const response = await request(app)
            .post(server)
            .send({
                username : "Ettore",
                email: "ettore.pazzouomo@test.it"
            })
            .set('Accept', 'application/json')
            .set({Authorization: 'Bearer 000'});
        expect(response.statusCode).toBe(500);
    });

    test("It should response the POST method negatively because strange password", async() =>{
        const response = await request(app)
            .post(server)
            .send({
                username : "Riccardo",
                email: "Riccardo.pazzouomo@test.it",
                password: +5
            })
            .set('Accept', 'application/json')
            .set({Authorization: 'Bearer 000'});
        expect(response.statusCode).toBe(500);
    });
});