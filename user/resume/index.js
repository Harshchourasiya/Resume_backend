const express = require("express");
const router = express.Router();
const {
  saveResume,
  getResumeData,
  deleteResume
} = require("./model/resumeModel");
const { failedRes, successRes } = require("../../helper/responesHelper");

const getUserIdFromReq = (req) => {
  return req.session.access_token;
};

/*
this request is to save resume or Create resume 
(required) data (Contains the data of the resume)
(optional) name (Name of the Resume)
(optional) resumeId (required only when user want to change the specific resume)
*/
router.post('/saveResume', async(req, res)=> {
  const isSuccess = await saveResume(getUserIdFromReq(req), req.body.resumeId, req.body.data, req.body.name);
  // isSuccess = true;
  if (isSuccess) {
    res.status(200).send(successRes);
  } else {
    res.status(400).send(failedRes);
  }
});

/*
This request will return the resume details
(required) resumeId 
*/
router.get('/getResume', async(req, res) => {
  const resume = await getResumeData(getUserIdFromReq(req), req.query.id);
  if (typeof resume == "boolean") {
    res.status(400).send(failedRes);
  } else {
    res.status(200).send(resume);
  }
});

/*
This delete request will delete the resume from the user account
(required) resumeId
*/
router.delete('/deleteResume', async(req, res)=> {
  const isSuccess = await deleteResume(getUserIdFromReq(req), req.body.resumeId);

  if (isSuccess) res.status(200).send(successRes);
  else res.status(400).send(failedRes);
})

module.exports = router;
