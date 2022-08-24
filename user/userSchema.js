const { Schema, mongoose } = require('mongoose');
const validator = require('validator')
const ResumeSchema = require('./resume/resumeSchema.js');

const tags = ["Founder", "Contributor"];

const UserSchema = new Schema({

  Email:  {
    type : String,
    required: true,
    unique: true,
    lowercase: true,
    validate: (value) => {
      return validator.isEmail(value)
    }
  }, 

  Password: {
   type: String,
   required : true,
   validate: (value) => {
    return validator.isStrongPassword(value);
   }   
  },

  Session: {
    type: String,
    unique : true
  },
  Name: {
    type: String,
    minLength : 3,
    maxLength : 20,
    required : true,
    validate : (value) =>{
      return validator.isAlpha(value);
    }
  },

  Tag:   {
    type : String,
    validate: (value) =>{
      return validator.matches(value, tags);
    }
  },
  Default: String,
  Resumes: {
    type: [ResumeSchema],
    defalut:  {},
    validate : (value) =>{
      return value.length < 5;
    }
  }
});

module.exports = UserSchema;