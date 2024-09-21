const mongoose = require('mongoose');


const connectDB = async()=>{
    await mongoose.connect('mongodb+srv://NamasteNode:Sagar%40DB143@namstenodenew.f4oih.mongodb.net/devTinder');
}


module.exports =connectDB