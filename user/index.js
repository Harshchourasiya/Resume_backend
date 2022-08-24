const express = require('express');
const router = express.Router();
const {containsEmail, createUserAndReturnIfSaved, isUserAuthentic, getUserInfo, saveResume} = require('./userModel');
const validator = require('validator');
const mail = require('../helper/mail');
const otp = require('otp-generator');
const {saveOTP, checkOTP} = require('../user/OTP/otpModel');



const getUserIdFromReq = (req) => {
    let userId;
    if (req.session.userId == null) {
        userId = req.body.userId;
    } else {
        userId = req.session.userId;
    }
    return userId;
}

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
    -> verificationCode,
    -> otpCode
    */
    const isCorrect = await checkOTP(req.body);
    const toRes = {
        status : "Failed"
    }

    if (isCorrect) {
        const isSaved = await createUserAndReturnIfSaved(req.body);
        if (isSaved)  {
            toRes.status = "Success";
            res.status(200).send(toRes);
        } else {
            res.status(400).send(toRes);
        }
    }
    else {
        res.status(400).send(toRes);
    } 

});

router.post('/login', async(req, res) => {

    /*
    to Use this client needs to provide 
    email : User email,
    password : user password, 
    isRemember : user want to remember the use
    */
    const isAuthentic = await isUserAuthentic(req.body.email, req.body.password, req.body.isRemember);
    if (isAuthentic) {
        if (req.body.isRemember) {
            req.session.userId = isAuthentic;
        }
        res.status(200).send({"status": "Success", "userId" : isAuthentic});
    } else {
        return res.status(400).send({"status": "UnAuthentic"});
    }
});

router.get('/info', async(req, res) => {

    /*
    userId or SessionId (optional if nessaray if user select not Remeber me)
    I will use req.userId and I will save User.id in the request if user choose not to remember
    */

    const toRes = await getUserInfo(userId);

    if (toRes == null) {
        res.status(400).send({"Status" : "Failed"});
    } else {
        res.status(200).send(toRes);
    }

});


router.post('/saveResume', async(req, res) => {
    /*
    Save Resume 
    UserId from Req or Body,
    htmlCode : HTML Resume Code,
    name : Name of the resume,
    */

    const toRes = await saveResume(getUserIdFromReq(req), req.body.htmlCode, req.body.name);

    if (toRes) {
        res.status(200).send({"status": "Success"});
    } else {
        res.status(400).send({"status": "failed"});
    }
});




module.exports = router;