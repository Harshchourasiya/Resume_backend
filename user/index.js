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

// Using express().use to send resume request to the resume/index.js file
// express().use("/resume", userResume);

//! This code is Duplicated Needed to Be Removed (We can create another file because this code is also used in resume/index.js file so We have to do that Later)
const getUserIdFromReq = (req) => {
  return req.cookies.access_token;
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

  // Send Mail
  mail.send({
    from: "Resume Builder <Harsh@gmail.com>",
    to: email,
    subject: "Hey, One Time Password is Here",
    text: `${code} is your otp`,
  });

  // Generate Verification Code
  const verificationCode = otp.generate(12, { specialChars: false });

  // storing OTP and Verification code and data
  const isSaved = saveOTP(code, verificationCode, req.body);
  // Checking if OTP is Not saved
  if (!isSaved) res.status(400).send(failedRes);

  // Sending res
  toRes.verificationCode = verificationCode;

  // for Checking sending otp
  if (process.env['TEST']) {
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
    if (isSaved != null) {
      res.status(200).send(successRes);
    } else {
      res.status(400).send(failedRes);
    }

  } else {
    res.status(400).send(failedRes);
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
    let maxDay = 1;
    if (req.body.isRemember) maxDay = 30; 
    const toRes = successRes;

    if (process.env['TEST']) toRes.access_token = isAuthentic; 
    res.cookie("access_token", isAuthentic, {
      httpOnly: true,
      maxDays : maxDay
    }).status(200).send(toRes);
  } else {
    res.status(400).send(failedRes);
  }
});

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

router.delete("/deleteAccount", async(req, res) => {
  const isSuccessful = await deleteUser(getUserIdFromReq(req));

  if (isSuccessful) {
    res.clearCookie('access_token');
    res.status(200).send(successRes);
  } else {

    res.status(400).send(failedRes);
  }

});

module.exports = router;
