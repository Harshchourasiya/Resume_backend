const { Schema} = require('mongoose');
const validator = require('validator')
const ResumeSchema = require('../resume/schema/resumeSchema');

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
  Resumes: {
    type: [ResumeSchema],
    defalut:  [],
    validate : (value) =>{
      return value.length < 5;
    }
  }
});

module.exports = UserSchema;