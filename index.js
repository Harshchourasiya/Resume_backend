const express = require('express');
require('./helper/databaseUtility').connectToServer;
const app = express();
const user = require('./user/index');
const userResume = require("./user/resume/index");
const cookieParser = require("cookie-parser");const sessions = require('express-session');
const oneDay = 1000 * 60 * 60 * 24;
const PORT = process.env['PORT'];
const cors = require("cors");
const {successRes, failedRes} = require('./helper/responesHelper');
const corsOptions ={
   origin:true, 
   credentials:true,            //access-control-allow-credentials:true
   optionSuccessStatus:200,
}

app.use(cors(corsOptions))

//session middleware
app.use(sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// cookie parser middleware
app.use(cookieParser());


app.use('/user', user);
app.use('/user/resume', userResume)

app.get('/', (req, res) => {
    const token = req.cookies.access_token;
    if (token) res.status(200).send(successRes);
    else res.status(400).send(failedRes);
});
app.listen(PORT);