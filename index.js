const express = require('express');
require('./helper/databaseUtility').connectToServer;
const app = express();
const user = require('./user/index');
const userResume = require("./user/resume/index");
const cookieParser = require("cookie-parser");
const sessions = require('express-session');
const oneDay = 1000 * 60 * 60 * 24;

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

app.listen(3000);