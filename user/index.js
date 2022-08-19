const express = require('express');
const router = express.Router();
const {containsEmail, createUser, isUserAuthentic} = require('./userModel');
const validator = require('validator');
const mail = require('../helper/mail');
const otp = require('otp-generator');
const {saveOTP, checkOTP} = require('../user/OTP/otpModel');

router.post('/new', async(req, res) =>{

    /*
    For this frontend needs to provide 
    -> email,
    -> password,
    -> name
    */


    const {email, password, name} = req.body;
    const toRes = {
        status: "",
        verificationCode: "Null"
    };

    if (!validator.isEmail(email) || ! validator.isAlpha(name) || ! validator.isStrongPassword(password) || (await containsEmail(email))) {
        toRes.status = "Failed";
        return res.status(400).send(toRes);
    }

    // Generate OTP Code
    const code = otp.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets : false });

    // Send Mail
    mail.send({
        from : "Resume Builder <Harsh@gmail.com>",
        to : email,
        subject : "Hey, One Time Password is Here",
        text: `${code} is your otp`
    });

    // Generate Verification Code
    const verificationCode = otp.generate(12, { specialChars: false });

    // storing OTP and Verification code and data
    saveOTP(code, verificationCode, req.body);

    // Sending res
    toRes.status = "Success";
    toRes.verificationCode = verificationCode;

    return res.status(200).send(toRes);
});


router.post('/otpverification', async(req, res) => {
    /*
    For this frontend needs to provide 
    -> email,
    -> password,
    -> name,
    -> verificationcode,
    -> otpcode
    */
    const isCorrect = await checkOTP(req.body);
    const toRes = {
        status : "Failed"
    }

    if (isCorrect) {
        createUser(req.body);
        toRes.status = "Success";
        res.status(200).send(toRes);
    }
    else {
        res.status(400).send(toRes);
    } 

});

router.post('/login', async(req, res) => {
    const isAuthentic = await isUserAuthentic(req.body.email, req.body.password);
    if (isAuthentic) {
        res.status(200).send({"status": "Success"});
    } else {
        return res.status(400).send({"status": "UnAuthentic"});
    }
});

module.exports = router;