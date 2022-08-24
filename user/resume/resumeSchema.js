// import mongoose from 'mongoose';
const { Schema } = require('mongoose');
const AnalyticSchema = require('./analyticSchema.js');
const validator = require('validator')

// ! I Will implement HTML Validator Later when I will be working on HTML Data
const ResumeSchema = new Schema({
  ResumeId : {
    type: String,
    unique : true
  },
  Name : {
    type: String,
    minLength : 5,
    maxLength: 50,
    validate : (value) =>{
      return validator.isAlphanumeric(value);
    }
  },
  HTMLCode: {
    type : String,
    required : true,
    minLength: 100,
    maxLength: 10000
  },
  IsRestricted: {
   type : Boolean,
   default: false
  },
  EmailAccessList: {
    type : [{
      type: String,
      lowercase: true,
      validate : (value) => {
        return validator.isEmail(value);
      }
  }]
  },
  AnalyticData: {
    type: AnalyticSchema,
    defalut:  {}
  }
});

module.exports = ResumeSchema;