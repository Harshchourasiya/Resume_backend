const { mongoose } = require("mongoose");
const userModel = mongoose.model("Users", require("../schema/userSchema"));
const otp = require("otp-generator");

const createUserAndReturnIfSaved = async (body) => {
  const user = new userModel();
  user.Email = body.email;
  user.Password = body.password;
  user.Name = body.name;
  user.Session = otp.generate(20, { specialChars: false });
  try {
    await user.save();
    return user.Session;
  } catch (err) {
    console.log(err);
    return false;
  }
};

const isUserAuthentic = async (email, password) => {
  email = email.toLowerCase();
  const user = await userModel
    .findOne({ Email: email })
    .where("Password")
    .eq(password)
    .exec();

  if (user == null) {
    return null;
  }

  // Creating Session ID and Passing it to the Client
  user.Session = otp.generate(20, { specialChars: false });
  await user.save();
  return user.Session;
};

// Does that Email Already Exits in the Database means The User Already Exists
const containsEmail = async (email) => {
  email = email.toLowerCase();
  const data = await userModel.findOne({ Email: email }).exec();
  return data != null;
};

// Geting User Info Like Name, Tag, Default and Resumes Array Which only Contains ResumeId , EmailAccessList and IsRestricted
const getUserInfo = async (userId) => {
  const userInfo = await userModel.findOne({ Session: userId });
  // checking user
  if (userInfo == null) return null;

  const resumes = [];
  // Storing the resumes data in the map'
  userInfo.Resumes.map((a) => {
    resumes.push({
      ResumeId: a.ResumeId,
      ResumeName: a.ResumeName
    });
  });
  const toRes = {
    Name: userInfo.Name,
    Email: userInfo.Email,
    Resumes: resumes,
  };

  return toRes;
};


const deleteUser = async (token) => {
  if (token == null) return false;
  try {
    await userModel.deleteOne({ Session: token });
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }

}

module.exports = {
  createUserAndReturnIfSaved: createUserAndReturnIfSaved,
  containsEmail: containsEmail,
  isUserAuthentic: isUserAuthentic,
  getUserInfo: getUserInfo,
  deleteUser: deleteUser
};
