//jshint esversion:6
require('dotenv').config()
const express = require('express')
const ejs = require('ejs')
const bodyParser = require('body-parser')
const app = express();
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended:true}))
const mongoose = require('mongoose')
const encrypt = require('mongoose-encryption')
mongoose.set('strictQuery', false);
mongoose.connect('mongodb://127.0.0.1:27017/userDB')

const userSchema = new mongoose.Schema(
    {
        email :String,
        password :String
    }
)

userSchema.plugin(encrypt, {secret:process.env.SECRET, encryptedFields:["password"]})
const User = mongoose.model('User',userSchema)
app.get('/', (req, res) =>{
    res.render('home')
})
app.get('/login', (req, res) =>{
    res.render('login')
})
app.get('/register', (req, res) =>{
    res.render('register')
})
//post
app.post('/register', (req, res) =>{
    const user = new User(
        {
            email: req.body.username,
            password: req.body.password
        }
    )
    user.save(function(err){
        if(err){
            console.log(err);
        }
        else{
            res.render("secrets")
        }
    })
})

app.post('/login', (req, res) =>{
    User.findOne({email: req.body.username},
       function(err, foundUser){
          if(err){
             console.log(err);
          }
          else{
            if(foundUser.password === req.body.password){
                res.render("secrets")
            }
          }  
       })
})
app.listen(3000,function(){
    console.log("connection successfully");
})