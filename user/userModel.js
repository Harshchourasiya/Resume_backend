const {mongoose} = require('mongoose');
const userSchema = require('./userSchema');
const validator = require('validator');
const userModel = mongoose.model('Users', userSchema);
const otp = require('otp-generator');

const createUserAndReturnIfSaved = async(body) => {
    const user = new userModel;
    user.Email = body.email;
    user.Password = body.password;
    user.Name = body.name;
    let isSaved = false;
    await user.save().then(
        ()=>{
            isSaved = true;
        }
    ).catch((err) => {
        isSaved = false;
     });

    return isSaved;
}



const isUserAuthentic = async(email, password, isRemember) => {
   const user = await userModel.findOne({Email : email}).exec();

    if (user == null || !validator.equals(password,user.Password)){
        return null;
    }   


    user.Session.id = otp.generate(20, {specialChars: false });
    await user.save();
    return user.Session; 
}


const containsEmail = async(email) => {
   const data = await userModel.findOne({Email : email}).exec();
   return data != null;
}


const getUserInfo = async(userId) => {
    const userInfo = await userModel.findOne({Session : userId});
    const resumes = [];
    userInfo.Resumes.map((a) => {
        resumes.append({
            ResumeId : a.ResumeId,
            EmailAccessList : a.EmailAccessList,
            IsRestricted : a.IsRestricted
        });
    });
    const toRes = {
        Name : userInfo.Name,
        Tag : userInfo.Tag,
        Default : userInfo.Default,
        Resumes : resumes
    }

    return toRes;
} 


module.exports = {
    createUserAndReturnIfSaved : createUserAndReturnIfSaved,
    containsEmail : containsEmail,
    isUserAuthentic : isUserAuthentic,
    getUserInfo : getUserInfo
}
