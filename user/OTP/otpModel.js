const { Schema, mongoose } = require('mongoose');
const validator = require('validator')
const {encodeOTPVerificationCode, decodeOTPVerificationCode} = require('../../helper/crypto');

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

const model = mongoose.model('otps', otpSchema);


// TODO : Error Handling is remains

const saveOTP = (otpCode, verificationCode, body) => {
        // encoding data 
    const data =  encodeOTPVerificationCode({
        email:body.email, password: body.password, name : body.name}, otpCode);

    const verificationData = new model();
    verificationData.otpCode = otpCode;
    verificationData.verificationCode = verificationCode;
    verificationData.data = data;
    verificationData.save().then(console.log("Save")).catch(err => {
        console.log(err);
    });
}

const checkOTP = async(body) => {
    const data = await model.findOneAndDelete({verificationCode : body.verificationCode}).exec();
    
    if (data == null) return false;

    const userData =  decodeOTPVerificationCode(data.data, data.otpCode);

    if (userData == null) return false;

    if (body.email !== userData.email || body.name !== userData.name || body.password !== userData.password) {
        return false;
    }
    return data.otpCode === body.otpCode;
}

module.exports = {
    saveOTP : saveOTP,
    checkOTP : checkOTP
}