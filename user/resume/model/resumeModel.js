const { mongoose } = require("mongoose");
const otp = require("otp-generator");
const userModel = mongoose.model("users", require("../../schema/userSchema"));

// Saving Resume
const saveResume = async (userId, resumeId, data, name) => {
  const user = await userModel.findOne({ Session: userId });
  // checking User exits
  if (user === null) return false;

  let idx = user.Resumes.findIndex((resume) => {
    return resume.ResumeId === resumeId
  });

  if (idx < 0) {
    // Creating Resume
    const resume = {};
    // Validating Name if Name is not given by the client then random name will generate
    if (name === null) name = "Resume" + otp.generate(6, { specialChars: false });
    resume.ResumeName = name;
    resume.ResumeId = otp.generate(20, { specialChars: false })
    setDataToResume(resume, data);
    user.Resumes.push(resume);
  } else {
    // saving data
    resume.ResumeName = name;
    const resume = user.Resumes[idx];
    setDataToResume(resume, data);
  }


  try {
    await user.save();
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}


const setDataToResume = (resume, data) => {
  resume.Name = data.name;
  resume.Position = data.position,
    resume.AboutMe = data.aboutMe,
    resume.Educations = [];
  data.educations.map((education) => {
    const edu = {
      CollegeName: education.collegeName,
      Major: education.major,
      CGPA: education.CGPA,
      Starting: education.starting,
      Ending: education.ending
    };

    resume.Educations.push(edu);
  });
  resume.Experiences = [];
  data.experiences.map((exp) => {
    const experience = {
      CompanyName: exp.companyName,
      Position: exp.position,
      Duties: exp.duties,
      Starting: exp.starting,
      Ending: exp.ending
    };
    resume.Experiences.push(experience);
  });

  resume.Projects = [];
  data.projects.map((project) => {
    const pro = {
      Name: project.name,
      Link: project.link,
      Detail: project.detail
    };
    resume.Projects.push(pro);
  });

  resume.Profiles = [];
  data.profiles.map((profile) => {
    const pro = {
      Name: profile.name,
      Link: profile.link
    };

    resume.Profiles.push(pro);
  });

  resume.Skills = [];
  data.skills.map((skill) => resume.Skills.push(skill));
}

const getResumeData = async (userId, resumeId) => {
  const user = await userModel.findOne({ SessionId: userId });
  let idx = user.Resumes.findIndex((resume) => {
    return resume.ResumeId === resumeId
  });
  if (idx < 0) return false;
  return user.Resumes[idx];
}


const deleteResume = async (userId, resumeId) => {
  const user = await userModel.findOne({ SessionId: userId });
  if (user == null) return false;

  const resumes = [];
  user.Resumes.map((resume) => {
    if (resume.ResumeId !== resumeId) resumes.push(resume);
  });
  user.Resumes = resumes;
  try {
    await user.save();
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

module.exports = {
  getResumeData: getResumeData,
  saveResume: saveResume,
  deleteResume : deleteResume
};
