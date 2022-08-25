const { mongoose } = require("mongoose");
const htmlValidator = require("html-validator");
const otp = require("otp-generator");
const userModel = mongoose.model("Users", require("../../schema/userSchema"));

// Saving Resume
const saveResume = async (userId, code, name) => {
  // Validating Name if Name is not given by the client then random name will generate
  if (name == null) name = "Resume" + otp.generate(6, { specialChars: false });

  // Validate HTML CODE here
  const options = {
    validator: "WHATWG",
    data: code,
    isFragment: true,
  };
  let result;
  try {
    result = await htmlValidator(options);
  } catch (error) {
    console.error(error);
    return false;
  }
  // sending false responed if HTML is not valid
  if (!result.isValid) return false;

  // HTML Already Verified, Saving data in Database

  const userResume = await userModel.findOne({ SessionId: userId });

  if (userResume == null) return false;

  // adding resume in user database
  const Resume = {
    Name: name,
    ResumeId: otp.generate(20, { specialChars: false }),
    HTMLCode: code,
    EmailAccessList: [],
  };
  userResume.Resumes.push(Resume);

  try {
    // saved
    await userResume.save();
    return true;
  } catch (err) {
    console.log(err);
    // not saved
    return false;
  }
};

const setDefaultResume = async (userId, resumeId) => {
  const user = await userModel.findOne({ SessionId: userId });

  // checking User exits
  if (user == null) return false;

  // Checking if ResumeId Contains in the user's Database resume
  let idx = user.Resumes.findIndex((resume) => {
    return resume.ResumeId === resumeId
  });
  if (idx < 0) return false;

  // Checking is Successful
  user.Default = resumeId;
  try {
    await user.save();
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

const setResumeRestricted = async (userId, resumeId) => {
  const user = await userModel.findOne({ SessionId: userId });

  // checking User exits
  if (user == null) return false;

  let idx = user.Resumes.findIndex((resume) => {
    return resume.ResumeId === resumeId
  });
  if (idx < 0) return false;

  try {
    await user.save();
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

const addAccessEmailList = async (userId, resumeId, emailList) => {
  const user = await userModel.findOne({ SessionId: userId });

  // checking User exits
  if (user == null) return false;

  let idx = user.Resumes.findIndex((resume) => {
    return resume.ResumeId === resumeId
  });

  if (idx < 0) return false;

  // saving data
  emailList.map((email) => {
    email = email.toLowerCase();
    if (!user.Resumes[idx].EmailAccessList.includes(email)) {
      user.Resumes[idx].EmailAccessList.push(email);
    }
  });

  try {
    await user.save();
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

module.exports = {
  saveResume: saveResume,
  setDefaultResume: setDefaultResume,
  setResumeRestricted: setResumeRestricted,
  addAccessEmailList: addAccessEmailList,
};
