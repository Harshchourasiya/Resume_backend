const {mongoose} = require('mongoose');
const userSchema = require('./userSchema');
const validator = require('validator');
const htmlValidator = require('html-validator')
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


const saveResume = async(userId, code, name) => {
    
    // Validate HTML CODE here
    const options = {
        validator: 'WHATWG',
        data: code,
        isFragment: true
      }
      let result;
      try {
        result = await htmlValidator(options)
      } catch (error) {
        console.error(error)
        return false;
      }
      // sending false responed if HTML is not valid
      if (!result.isValid) return false;

    // HTML Already Verified, Saving data in Database

    userResume = await userModel.findOne({SessionId : userId});
    
    // adding resume in user database
    const Resume = {
        Name : name,
        ResumeId : otp.generate(20, {specialChars: false }),
        HTMLCode : code,
        EmailAccessList: []
    };
    userResume.Resumes.push(Resume);

    try {
        // saved
        await userResume.save();
        return true;
    } catch(err) {
        console.log(err);
        // not saved
        return false;
    }

}


module.exports = {
    createUserAndReturnIfSaved : createUserAndReturnIfSaved,
    containsEmail : containsEmail,
    isUserAuthentic : isUserAuthentic,
    getUserInfo : getUserInfo,
    saveResume : saveResume
}
