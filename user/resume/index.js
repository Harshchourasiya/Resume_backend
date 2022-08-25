const express = require("express");
const router = express.Router();
const {
  saveResume,
  setDefaultResume,
  setResumeRestricted,
  addAccessEmailList,
} = require("./model/resumeModel");
const { failedRes, successRes } = require("../../helper/responesHelper");

//! This is code is a Duplicate of the code used in the ../index.js
const getUserIdFromReq = (req) => {
  let userId;
  if (req.session.userId == null) {
    userId = req.body.userId;
  } else {
    userId = req.session.userId;
  }
  return userId;
};
router.post("/saveResume", async (req, res) => {
  /*
      Save Resume 
      UserId from Req or Body,
      htmlCode : HTML Resume Code,
      name : Name of the resume,
      */

  const toRes = await saveResume(
    getUserIdFromReq(req),
    req.body.htmlCode,
    req.body.name
  );

  if (toRes) {
    res.status(200).send(successRes);
  } else {
    res.status(400).send(failedRes);
  }
});

router.post("/setDefaultResume", async (req, res) => {
  /*
      Set Default Resume, If someone visit the main Url of the user that Resume will be display
      Required ResumeID
      */

  const isSuccess = await setDefaultResume(
    getUserIdFromReq(req),
    req.body.ResumeId
  );

  if (isSuccess) {
    res.status(200).send(successRes);
  } else {
    res.status(400).send(failedRes);
  }
});

router.post("/setResumeRestricted", async (req, res) => {
  /*
      Client Must Provide ResumeId From which client want to restricted
      If The Restriction is already then this is set false
      ResumeID (Required) 
      */

  const isSuccess = await setResumeRestricted(
    getUserIdFromReq(req),
    req.body.ResumeId
  );

  // TODO: Maybe this will be because a duplicate code we can make a method for this one
  if (isSuccess) {
    res.status(200).send(successRes);
  } else {
    res.status(400).send(failedRes);
  }
});

router.post("/addAccessEmailList", async (req, res) => {
  /*
  UserId if Not save its best if client provide the userId or 
      this will add the access Email to the restricted Resume (50 is Max Limite)
      ResumeId (Required),
      AccessEmailList (Required) (Array)
      */

  const isSuccess = await addAccessEmailList(
    getUserIdFromReq(req),
    req.body.ResumeId,
    req.body.AccessEmailList
  );
  // TODO: Maybe this will be because a duplicate code we can make a method for this one
  if (isSuccess) {
    res.status(200).send(successRes);
  } else {
    res.status(400).send(failedRes);
  }
});

module.exports = router;
