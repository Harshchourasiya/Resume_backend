const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env['DATABASE_URI'];

async function connectToServer() {
    await mongoose.connect(uri);
} 
module.exports = {
    connectToServer : connectToServer().then(console.log("Connect")).catch((err)=> console.log(err)),

    getClient: ()=> {
      return mongoose;
    }
  };