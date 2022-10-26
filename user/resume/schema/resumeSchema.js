const { Schema } = require('mongoose');
const validator = require('validator')


const Educations = new Schema({
  CollegeName : {
    type: String,
    maxLength : 100
  },
  Major : {
    type: String,
    maxLength : 100
  },
  CGPA :String,
  Starting : String,
  Ending : String
});

const Experiences = new Schema({
  CompanyName : {
    type: String,
    maxLength : 100
  },
  Position : {
    type: String,
    maxLength : 100
  },
  Duties : {
    type : String,
    maxLength : 1500  
  },
  Starting : String,
  Ending : String
});

const Projects = new Schema({
  Name : {
    type: String,
    maxLength : 100
  },
  Link : {
    type: String,
    minLength: 1,
    maxLength : 100
  },
  Detail : {
    type : String,
    maxLength : 1500
  }
});

const Profiles = new Schema({
  Name : {
    type: String,
    maxLength : 100
  },
  Link : {
    type: String,
    maxLength : 100
  }
});


const ResumeSchema = new Schema({
  ResumeId : {
    type: String
  },
  ResumeName : {
    type: String,
    maxLength: 50
  },
  Name : {
    type : String,
    maxLength : 50
  },
  Position : {
    type : String,
    maxLength : 50
  },
  AboutMe : {
    type: String,
    maxLength : 1500
  },
  Educations : {
    type: [Educations]
  },
  Experiences: [Experiences],
  Projects : [Projects],
  Profiles : [Profiles],
  Skills : [String]
});

module.exports = ResumeSchema;