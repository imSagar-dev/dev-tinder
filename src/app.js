//express imported
const express = require("express");
const app = express();

//middleware creation
const { adminAuth } = require("./middleware/auth");

//database connection method imported
const connectDB = require("./config/database");

// import models
const userModel = require("./models/user.schema");

// to handle request body
app.use(express.json())
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

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

// app.post("/user", adminAuth, async (req, res) => {
//   const user = new userModel({
//     firstName: "pratik",
//     lastName: "deshmukh",
//     mobileNumber: 9850950375,
//     email: "pratik.d@gmail.com",
//     age: 27,
//     gnder: "male",
//   });

//   const resp = await user.save();
//   res.json(resp);
// });

app.post("/signup", async(req, res) => {
  const user = new userModel(req.body);
  const resp = await user.save();
  res.json(resp)
});

app.get("/user", adminAuth, async (req, res) => {
  const user = await userModel.find();
  res.send(user);
});

app.patch("/user", adminAuth, async (req, res) => {
    try {
        await userModel.findOneAndUpdate({age:34},req.body);
        res.send("User updated successfully !!!");
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
