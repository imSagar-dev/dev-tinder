const mongoose = require("mongoose");
const validator = require('validator');
const {decryption} = require('../utils/encrypt-decrypt');

const userSchema = mongoose.Schema({
  firstName: {
    type: String,
    required:true,
    minLength:5,
    maxLength:30,
    trim:true
  },
  lastName: {
    type: String,
    minLength:5,
    maxLength:30,
    trim:true
  },
  mobileNumber: {
    type: String,
    minLength:10,
    maxLength:10
  },
  email: {
    type: String,
    required:true,
    unique:true,
    trim:true
  },
  age: {
    type: Number,
  },
  aboutMe:{
    type:String,
    default:"This is default About me "
  },
  gender: {
    type: String,
    validate(value){
      if(!['male','female','other'].includes(value.toLowerCase())){
        throw new Error('Invalid gender')
      }
    }
  },
  profileImage:{
    type:String,
    validate(value){
      if(!validator.isURL(value)){
        throw new Error('Invalid profile image URL: '+value)
      }
    }
  },
  password:{
    type:String,
    required:true,
    validate(value){
      if(!validator.isStrongPassword(value)){
        throw new Error("password should be strong");
      }
    }
  }
},{timestamps:true});


userSchema.methods.validatePassword= async function(password){
  const user = this;
  const isValid  = await decryption(password, user.password);
  return isValid;
}
const userModel = mongoose.model("User", userSchema);
module.exports = userModel;
