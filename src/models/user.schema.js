const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  mobileNumber: {
    type: Number,
    length: 10,
  },
  email: {
    type: String,
  },
  age: {
    type: Number,
  },
  gnder: {
    type: String,
  },
});

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;
