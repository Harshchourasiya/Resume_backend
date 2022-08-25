const {mongoose} = require('mongoose');
const userModel = mongoose.model('Users', require('../schema/userSchema'));
const otp = require('otp-generator');

const createUserAndReturnIfSaved = async(body) => {
    const user = new userModel;
    user.Email = body.email;
    user.Password = body.password;
    user.Name = body.name;
    user.Session = otp.generate(20, {specialChars: false });
    try {
        await user.save();
        return user.Session;
    } catch(err) {
        console.log(err);
        return null;
    }
}



const isUserAuthentic = async(email, password) => {
   const user = await userModel.findOne({Email : email}).where('Password').eq(password).exec();

    if (user === undefined){
        return null;
    }   

    // Creating Session ID and Passing it to the Client
    user.Session = otp.generate(20, {specialChars: false });
    await user.save();
    return user.Session; 
}


// Does that Email Already Exits in the Database means The User Already Exists
const containsEmail = async(email) => {
   const data = await userModel.findOne({Email : email}).exec();
   return data != null;
}


// Geting User Info Like Name, Tag, Default and Resumes Array Which only Contains ResumeId , EmailAccessList and IsRestricted
const getUserInfo = async(userId) => {
    const userInfo = await userModel.findOne({Session : userId});
    const resumes = [];
    // Storing the resumes data in the map
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
