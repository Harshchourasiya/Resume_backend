const CryptoJS = require("crypto-js");


// Encrypt
const encodeOTPVerificationCode = (data, otp) => {
    return CryptoJS.AES.encrypt(JSON.stringify(data), otp).toString();
} 

// Decrypt

const decodeOTPVerificationCode = (data, otp) => {
    const bytes  = CryptoJS.AES.decrypt(data, otp);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
}

module.exports = {
    encodeOTPVerificationCode : encodeOTPVerificationCode,
    decodeOTPVerificationCode : decodeOTPVerificationCode
}