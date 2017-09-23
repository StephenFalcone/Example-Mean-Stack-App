//Express Module
const express = require('express');
const app = express();
const path = require('path');

//Bring in Modules
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose'); //const mongo = require('mongodb').MongoClient;

//configuration file for MongoDB
const config = require('./config/database');

//Connect to Database
mongoose.Promise = global.Promise;
mongoose.connect(config.database, {useMongoClient: true
});

// On Connection to DB
mongoose.connection.on('connected', function(){
    console.log('Connected to database ' +config.database);
});

//On Error in DB
mongoose.connection.on('error', function(err){
    console.log('Database Error: ' +err);
});

//Set port to whatever is inputted or 3000 if none
var port = process.env.PORT || 3000;

//Allows you to make request to API from different domain name
app.use(cors());

//Set Static Folder. This is where angular/client side app will be.
app.use(express.static(path.join(__dirname, 'public')));

//Body Parser Middleware. Allows you to grab data from submitted forms, etc.
app.use(bodyParser.json());

//Passport Middleware.
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

//Routing  HAS TO COME AFTER MIDDLEWARE
const users = require('./routes/users');
app.use('/users', users);

//Index Route
app.get('/', function(req,res) {
    res.send('Invalid Endpoint');
    console.log('app.get BEING USED');
});

//Start Server
app.listen(port, function(){
    console.log('Server started on port '+port)
});