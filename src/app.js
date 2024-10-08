//express imported
const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
//database connection method imported
const connectDB = require("./config/database");
//import routes index
const router = require('./routes');
const cors = require('cors');

// middleware to handle request body
app.use(express.json());
app.use(cookieParser());
app.use(cors({credentials:true , domain: 'http://localhost:5137'}))
app.use('',router);
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
