// Importing mocha and chai
const mocha = require('mocha')
const chai = require('chai')
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

chai.expect();
chai.should();
// pass this instead of server to avoid error
require('dotenv').config();
const API = 'http://localhost:'+ process.env['PORT']

describe("Now Let's Checkout that website", () => {
    let otpCode, verificationCode, token, data;
    const dataToSend = {
        email : "HarshChourasiya@yahoo.com", 
        password : "Password@123",
        name : "Harsh"
     };

    it("Well First Create Account", (done) => {
        chai
        .request(API)
        .post("/user/new")
        .set('content-type', 'application/json')
        .send(dataToSend)
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('verificationCode');
            otpCode = res.body.otpCode;
            verificationCode = res.body.verificationCode;
            done();
        })
    });

    it ("Ahh, So they also verify Email Address, Let me get it", (done) => {
        data = dataToSend;
        data.otpCode = otpCode;
        data.verificationCode = verificationCode;
        chai
        .request(API)
        .post("/user/otpverification")
        .set('content-type', 'application/json')
        .send(data)
        .end((err, res) => {
            res.should.have.status(200);
            done();
        });
    });


    it ("Finally I only want to login the website", (done) => {
        data = dataToSend;
        data.isRemember = false;
        chai
        .request(API)
        .post("/user/login")
        .set('content-type', 'application/json')
        .send(data)
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('access_token');
            token = res.body.access_token;
            done();
        });
    })




    

    /*
    Still more story remains...
    */

    it ("Yayyy, Get a internship finally, Okay I don't need that website anymore for now so lets delete my account for now", (done) => {
        data = {access_token : token};
        chai
        .request(API)
        .delete("/user/deleteAccount")
        .send(data)
        .end((err, res) => {
            res.should.have.status(200);
            done();
        });
    });
})