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
    // Validating Name
    if (name == null) name = "Resume" +  otp.generate(6, {specialChars: false });
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

    const userResume = await userModel.findOne({SessionId : userId});
    
    if (userResume == null) return false;

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


const setDefaultResume = async(userId, resumeId)=> {
    const user = await userModel.findOne({SessionId : userId});

    // checking User exits
    if (user == null) return false;
    // Checking if ResumeId Contains in the user's Database resume

    // TODO: Can be Improved We can Use ResumeId find using Database but Its Not bad Either because User can not make more that 5 resume a time
    let isContains = false;
    user.Resumes.map((resume) => {
        if(resume.ResumeId == resumeId) {
            isContains = true;
        }
    });

    if (!isContains) return false;

    // Checking is Successful
    user.Default = resumeId;
    try {
        await user.save();
        return true;
    } catch(err) {
        console.log(err);
        return false;
    }
}


const setResumeRestricted = async(userId, resumeId) => {
    const user = await userModel.findOne({SessionId : userId});

    // checking User exits
    if (user == null) return false;

    let isSuccess = false;
    user.Resumes.map((resume) => {
        if (resume.ResumeId === resumeId) {
            isSuccess = true;
            resume.IsRestricted = !resume.IsRestricted;
        }
    });

    if (!isSuccess) return false;

    try {
        await user.save();
        return true;
    } catch(err) {
        console.log(err);
        return false;
    }
}


const addAccessEmailList = async(userId,resumeId, emailList) => {
    const user = await userModel.findOne({SessionId : userId});

    // checking User exits
    if (user == null) return false;
    let isSuccess = false;
    let idx;
    user.Resumes.map((resume, i) => {
        if (resume.ResumeId === resumeId) {
            isSuccess = true;
            idx = i;
        }
    });

    if (!isSuccess) return false;

    // saving data 

    emailList.map((email) => {
        email = email.toLowerCase();
        if (!user.Resumes[idx].EmailAccessList.includes(email)) {
            user.Resumes[idx].EmailAccessList.push(email);
        }
    });

    try {
        await user.save();
        return true;
    } catch(err) {
        console.log(err);
        return false;
    }

}



module.exports = {
    createUserAndReturnIfSaved : createUserAndReturnIfSaved,
    containsEmail : containsEmail,
    isUserAuthentic : isUserAuthentic,
    getUserInfo : getUserInfo,
    saveResume : saveResume,
    setDefaultResume : setDefaultResume,
    setResumeRestricted : setResumeRestricted,
    addAccessEmailList : addAccessEmailList
}
