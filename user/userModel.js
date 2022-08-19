const {mongoose} = require('mongoose');
const userSchema = require('./userSchema');
const validator = require('validator');
const userModel = mongoose.model('Users', userSchema);

const createUser = (body) => {
    const user = new userModel;
    user.Email = body.email;
    user.Password = body.password;
    user.Name = body.name;
    user.save()
    .then(console.log("SuccessFully Created"))
    .catch((err) => console.log(err));
};

const isUserAuthentic = async(email, password) => {
   const user = await userModel.findOne({Email : email}).exec();
    if (user == null) return false;
    if (!validator.equals(password,user.Password)) return false;

    return true;
}

const containsEmail = async(email) => {
   const data = await userModel.findOne({Email : email}).exec();
   return data != null;
}

module.exports = {
    createUser : createUser,
    containsEmail : containsEmail,
    isUserAuthentic : isUserAuthentic
}
