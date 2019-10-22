//jshint esversion:6
require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://localhost:27017/secretsDB", {useNewUrlParser: true,  useUnifiedTopology: true} );

const userSchema = new mongoose.Schema({
    userName: String,
    passWord: String
});

// access environment variables in .env file
console.log(process.env.API_KEY);
// process.env.SECRET is defined in .env file
userSchema.plugin(encrypt, { secret: process.env.SECRET ,encryptedFields: ['passWord']});

const User = mongoose.model("user", userSchema);

app.listen(3000, function () {
    console.log("Server started on port 3000");
});


app.get("/", function (req, res) {
    res.render("home.ejs");
});

app.get("/login", function (req, res) {
    res.render("login.ejs");
});

app.get("/register", function (req, res) {
    res.render("register.ejs");
});

app.post("/register", function (req, res) {
    const newUser = new User({
        userName: req.body.username,
        passWord: req.body.password
    });

    newUser.save(function (err) {
        if (!err){
            console.log("Successfully registered");
            res.render('secrets.ejs');
        }else{
            console.log(err);
        }
    });
});

app.post("/login", function (req, res) {
   const userName = req.body.username;
   const passWord = req.body.password;

   User.findOne({userName: userName}, function (err, foundUser) {
       if (err){
           console.log(err)
       }else {
           if (foundUser){
               // console.log(foundUser.passWord);
               if (foundUser.passWord === passWord){
                   res.render('secrets.ejs');
               }
           }
       }
   })
});
