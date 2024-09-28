const mongoose = require("mongoose");
const validator = require('validator');
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
  }
},{timestamps:true});

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;
