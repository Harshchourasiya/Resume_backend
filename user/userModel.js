const {mongoose} = require('mongoose');
const userSchema = require('./userSchema');

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

const containsEmail = async(email) => {
   const data = await userModel.findOne({Email : email}).exec();
   return data != null;
}

module.exports = {
    createUser : createUser,
    containsEmail : containsEmail
}
