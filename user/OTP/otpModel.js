const { mongoose } = require('mongoose');
const {encodeOTPVerificationCode, decodeOTPVerificationCode} = require('../../helper/crypto');
const model = mongoose.model('otps', require('./otpSchema'));
const validator = require('validator');

const saveOTP = async(otpCode, verificationCode, body) => {
        // encoding data 
    const data =  encodeOTPVerificationCode({
        email:body.email, password: body.password, name : body.name}, otpCode);

    const verificationData = new model();
    verificationData.otpCode = otpCode;
    verificationData.verificationCode = verificationCode;
    verificationData.data = data;

    try {
        await verificationData.save();
        return true;
    } catch(err) {
        console.log(err);
        return false;
    }
}

const checkOTP = async(body) => {
    const data = await model.findOne({verificationCode : body.verificationCode}).exec();
    
    if (data == null) return false;

    const userData =  decodeOTPVerificationCode(data.data, data.otpCode);

    if (userData == null) return false;

    if (!validator.equals(body.email, userData.email) || 
    !validator.equals(body.name, userData.name) || 
    !validator.equals(body.password, userData.password)) {
        return false;
    }
    return data.otpCode === body.otpCode;
}

module.exports = {
    saveOTP : saveOTP,
    checkOTP : checkOTP
}