//express imported
const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();

//import external libs
const validator = require("validator");
const jwt = require("jsonwebtoken");

//import utils
const { signupValidate, validateLoginBody ,validateChangePasswordBody} = require("./utils/validations");
const { encryption, decryption } = require("./utils/encrypt-decrypt");
//middleware creation
const { userAuth } = require("./middleware/auth");

//database connection method imported
const connectDB = require("./config/database");

// import models
const User = require("./models/user.schema");
const userModel = require("./models/user.schema");

// middleware to handle request body
app.use(express.json());
app.use(cookieParser());

connectDB()
  .then(() => {
    console.log("DB connection established");
    app.listen(3000, () => {
      console.log("Server listening on port 3000");
    });
  })
  .catch((err) => {
    console.log("DB not connected !!");
  });

app.post("/signup", async (req, res) => {
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

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!validator.isEmail(username)) {
      throw new Error("Invalid username");
    }
    //validate login body
    validateLoginBody(req.body);

    const user = await userModel.findOne({ email: username });

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

app.get("/feed", userAuth, async (req, res) => {
  const user = await User.find();
  res.send(user);
});

app.get("/profile", userAuth, async (req, res) => {
  res.send(req.user);
});

app.patch("/profile", userAuth, async (req, res) => {
  try {
    if (req.body.password) {
      req.body.password = await encryption(req.body.password);
    }

    if (!validator.isEmail(req.body.email)) {
      throw new Error("Invalid username");
    }

    const response = await User.findOneAndUpdate({ email: req.body.email }, req.body, {
      after: true,
      runValidators: true,
    });
    if(response){
      res.send("User updated successfully !!!");
    }else{
      res.status(404).send('User not found !!!');
    }
  
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.delete("/profile", userAuth, async (req, res) => {
  try {
    if (!validator.isEmail(req.body.email)) {
      throw new Error("Invalid email");
    }

    const user = await User.findOneAndDelete({ email: req.body.email });
    if (!user) {
      res.status(404).send("User not found");
    } else {
      res.send("user deleted successfully !!!");
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.post('/changePassword',userAuth,async(req,res)=>{
  try {
    validateChangePasswordBody(req.body);
    const {password , newPassword} = req.body;
    const isExistingPasswordValid = await decryption(password,req.user.password);
    if(!isExistingPasswordValid){
      throw new Error('Invalid existing password !!');
    }
    const encodedNewPassword = await encryption(newPassword);
    const response = await userModel.findByIdAndUpdate({_id : req.user._id},{password:encodedNewPassword},{after:true});
    res.clearCookie("token");
    res.send(response)
  } catch (error) {
    res.status(400).send(error.message);
  }
});
