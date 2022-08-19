const express = require('express');
require('./helper/databaseUtility.js').connectToServer;
const app = express();
const user = require('./user/index.js');

app.use(express.json());
app.use('/user', user);


app.listen(3000);