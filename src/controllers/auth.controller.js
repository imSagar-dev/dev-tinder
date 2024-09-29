const express = require('express');
const authController = express.Router();

//import utils
const { signupValidate, validateLoginBody ,validateChangePasswordBody} = require("../utils/validations");
const { encryption, decryption } = require("../utils/encrypt-decrypt");
//middleware creation
const { userAuth } = require("../middleware/auth");
//import external library
const validator = require("validator");
const jwt = require("jsonwebtoken");
// import models
const User = require("../models/user.schema");

authController.get('/sample',(req,res)=>{
    try {
        res.send('sample router working fine !!');
    } catch (error) {
        res.status(400).send('this is sample router request');
    }
});

authController.post("/signup", async (req, res) => {
    try {
      //validate body with utils
      signupValidate(req.body);
      if (!validator.isEmail(req.body?.email)) {
        throw new Error("Invalid email id");
      }
      req.body.password = await encryption(req.body.password);
      const user = new User(req.body);
      const resp = await user.save();
      res.json(resp);
    } catch (error) {
      res.send(error.message);
    }
  });

  authController.post("/login", async (req, res) => {
    try {
      const { username, password } = req.body;
  
      if (!validator.isEmail(username)) {
        throw new Error("Invalid username");
      }
      //validate login body
      validateLoginBody(req.body);
  
      const user = await User.findOne({ email: username });
  
      if (!user) {
        throw new Error("Invalid Username or password ");
      }
  
      //using schema methods validating password 
      const isPasswordValid = await user.validatePassword(password);
  
      if (!isPasswordValid) {
        throw new Error("Invalid Username or password ");
      } else {
        //create JWT token
        const token = jwt.sign({ id: user._id }, "secret@123");
        res.cookie("token", token);
        res.json({ message: "Login Success !!!" });
      }
    } catch (error) {
      res.status(400).send(error.message);
    }
  });


  authController.post('/changePassword',userAuth,async(req,res)=>{
    try {
      validateChangePasswordBody(req.body);
      const {password , newPassword} = req.body;
      const isExistingPasswordValid = await decryption(password,req.user.password);
      if(!isExistingPasswordValid){
        throw new Error('Invalid existing password !!');
      }
      const encodedNewPassword = await encryption(newPassword);
      const response = await User.findByIdAndUpdate({_id : req.user._id},{password:encodedNewPassword},{after:true});
      res.clearCookie("token");
      if(!response){
        throw new Error('User Not found !!')
      }
      res.send('Password changed successfully !! , please re-login ')
    } catch (error) {
      res.status(400).send(error.message);
    }
  });


  authController.post('/logout',async (req,res)=>{
    res.cookie("token",null ,{expires:new Date( Date.now())});
    res.send('Logout successfully !!');
  })

module.exports = authController;