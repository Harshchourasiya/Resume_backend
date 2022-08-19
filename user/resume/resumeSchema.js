// import mongoose from 'mongoose';
const { Schema } = require('mongoose');
const AnalyticSchema = require('./analyticSchema.js');
const validator = require('validator')

// ! I Will implement HTML Validator Later when I will be working on HTML Data
const ResumeSchema = new Schema({
  HTMLCode: {
    type : String,
    required : true,
    minLength: 100,
    maxLength: 1000
  },
  IsRestricted: {
   type : Boolean,
   default: false
  },
  EmailAccessList: {
    type : [String],
    lowercase: true,
    validate : (value) => {
      return validator.isEmail(value);
    }
  },
  AnalyticData: {
    type: AnalyticSchema,
    defalut:  {}
  }
});

module.exports = ResumeSchema;