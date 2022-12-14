const express = require("express");
const router = express.Router();
const {
  containsEmail,
  createUserAndReturnIfSaved,
  isUserAuthentic,
  getUserInfo,
  deleteUser
} = require("./model/userModel");

const validator = require("validator");
const mail = require("../helper/mail");
const otp = require("otp-generator");
const { saveOTP, checkOTP } = require("./OTP/otpModel");
const { failedRes, successRes } = require("../helper/responesHelper");
const {OTP_MAIL_FROM, OTP_MAIL_SUBJECT, GET_OTP_MAIL_HTML} = require("../helper/string")
const isDevelopment = process.env['DEVELOPMENT'];
const getUserIdFromReq = (req) => {
  return req.body.access_token == undefined ? req.session.access_token : req.body.access_token;
};

router.post("/new", async (req, res) => {
  /*
    For this frontend needs to provide 
    -> email,
    -> password,
    -> name
    */

  const { email, password, name } = req.body;
  const toRes = successRes;
  if (
    !validator.isEmail(email) ||
    !validator.isAlpha(name) ||
    !validator.isStrongPassword(password) ||
    (await containsEmail(email))
  ) {
    return res.status(400).send(failedRes);
  }

  // Generate OTP Code
  const code = otp.generate(6, {
    upperCaseAlphabets: false,
    specialChars: false,
    lowerCaseAlphabets: false,
  });

  let isOtpSend = true;
  // Send Mail
  if (isDevelopment!=1) {
    isOtpSend = await mail.send({
      from: OTP_MAIL_FROM,
      to: email,
      subject: OTP_MAIL_SUBJECT,
      html: GET_OTP_MAIL_HTML(code),
    });
  }
  
  if (!isOtpSend) return res.status(400).send(failedRes);
  // Generate Verification Code
  const verificationCode = otp.generate(12, { specialChars: false });

  // storing OTP and Verification code and data
  const isSaved = saveOTP(code, verificationCode, req.body);
  // Checking if OTP is Not saved
  if (!isSaved) return res.status(400).send(failedRes);

  // Sending res
  toRes.verificationCode = verificationCode;

  // for Checking sending otp
  if (isDevelopment==1) {
    toRes.otpCode = code;
  }

  return res.status(200).send(toRes);
});

router.post("/otpverification", async (req, res) => {
  /*
    For this frontend needs to provide 
    -> email,
    -> password,
    -> name,
    -> verificationCode,
    -> otpCode

    => return sessionId
    */
  const isCorrect = await checkOTP(req.body);

  if (isCorrect) {
    const isSaved = await createUserAndReturnIfSaved(req.body);
    if (isSaved) {
      res.status(200).send(successRes);
    } else {
      res.status(400).send(failedRes);
    }

  } else {
    return res.status(400).send(failedRes);
  }
});

router.post("/login", async (req, res) => {
  /*
    to Use this client needs to provide 
    email : User email,
    password : user password, 
    isRemember : user want to remember the use
    */
  const isAuthentic = await isUserAuthentic(req.body.email, req.body.password);

  if (isAuthentic) {
    // Saving the session Id in the user's system (IF isRemeber is True)
    const toRes = successRes;
    if (process.env['DEVELOPMENT']==1) toRes.access_token = isAuthentic; 
    req.session.access_token = isAuthentic;
    res.status(200).send(toRes);
  } else {
    res.status(400).send(failedRes);
  }
});

// User Info for Profile Page
router.get("/info", async (req, res) => {
  /*
    userId ()
    */
  const toRes = await getUserInfo(getUserIdFromReq(req));
  if (toRes == null) {
    res.status(400).send(failedRes);
  } else {
    res.status(200).send(toRes);
  }
});

// Logout

router.get("/logout", async(req, res) => {
  req.session.access_token = null;
  res.status(200).send(successRes);
  res.end();
});

// Deleting the Account of the User
router.delete("/deleteAccount", async(req, res) => {
  const isSuccessful = await deleteUser(getUserIdFromReq(req));
  if (isSuccessful) {
    if(isDevelopment != 1) res.session.access_token = null;
    res.status(200).send(successRes);
  } else {

    res.status(400).send(failedRes);
  }

});

module.exports = router;
