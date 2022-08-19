// import mongoose from 'mongoose';
const { Schema } = require('mongoose');

// TODO: I will validate them later when I work on Analytic Side of the website
const AnalyticSchema = new Schema({
  InstantExit: Number, 
  TotalVisitors: Number,
  TotalVisiteTime: Number,
  TotalSessionVisitor: Number,
  TotalVisitByPhone: Number,
  TotalVisitByComputer: Number,
  Links: [{
    Link: String,
    Visit: Number
  }]
  // I Will Implement Headmap here later
});

module.exports = AnalyticSchema;