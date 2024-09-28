//express imported
const express = require("express");
const app = express();

//import external libs
const validator = require('validator');
//middleware creation
const { adminAuth } = require("./middleware/auth");

//database connection method imported
const connectDB = require("./config/database");

// import models
const User = require("./models/user.schema");

// middleware to handle request body
app.use(express.json());

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
  const user = new User(req.body);
  try {
    const PERMITTED_BODY = ["firstName","lastName","email","mobileNumber","age","gender","profileImage"];
    if(!Object.keys(req.body).every(k=>PERMITTED_BODY.includes(k))){
      throw new Error("Invalid request body");
    }

    if(!validator.isEmail(req.body?.email)){
      throw new Error("Invalid email id");
    }
    const resp = await user.save();
    res.json(resp);
  } catch (error) {
    res.send(error.message)
  }


});

app.get("/feed", adminAuth, async (req, res) => {
  const user = await User.find();
  res.send(user);
});

app.patch("/user", adminAuth, async (req, res) => {
  try {
    await User.findOneAndUpdate({ email: req.body.email }, req.body,{after:true,runValidators:true});
    res.send("User updated successfully !!!");
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.get("/user", adminAuth, async (req, res) => {
  try {
   const user =  await User.findOne({ email: req.body.email });
   if(!user){
    res.status(404).send('User not found')
   }else{
    res.send(user)
   }
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.delete("/user", adminAuth, async (req, res) => {
  try {
   const user =  await User.findOneAndDelete({ email: req.body.email });
   if(!user){
    res.status(404).send('User not found')
   }else{
    res.send("user deleted successfully !!!")
   }
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// app.get('/test',(req,res,next)=>{
//     // res.send('Hello from test')
//     next();
// },(req,res,next)=>{
//     next();
//     res.send('test 2 nd resp using next');

// },(req,res,next)=>{
//     res.send('test 3rd resp using next');
//     // next();
// })

// app.post('/test',(req,res)=>{

//     res.json({message:'Post api working'})
// })
