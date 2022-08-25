const { Schema} = require('mongoose');
const validator = require('validator');

const otpSchema = new Schema({
    otpCode : {
        type : String,
        minLength : 6,
        maxLength : 6,
        required : true,
        validate : (value) =>{
            return validator.isNumeric(value);
        }
    },
    verificationCode : {
        type : String,
        unique: true,
        minLength : 12,
        maxLength : 12,
        required: true
    },
    data : {
        type : String,
        required : true
    }
});

module.exports = otpSchema;