const express = require('express');
const requestController = express.Router();
// import models
const User = require("../models/user.schema");
const ConnectionRequest = require('../models/connectionRequest.schema');
//import response util
const {response} = require('../utils/responseUtil');

requestController.get("/feed",async (req, res) => {
    const user = await User.find();
    res.send(user);
  });

requestController.post('/:status/:toUserId',async (req,res)=>{
  try {
    const status = req.params.status;
    const toUserId = req.params.toUserId;
    const fromUserId = req.user._id;

    //Check whether request already send
    const isAlreadyExist = await ConnectionRequest.findOne({
      $or:[
        {fromUserId,toUserId},
        {fromUserId:toUserId , toUserId:fromUserId}
      ]
    });

    if(isAlreadyExist){
      return response(res,400,null,'Request already sent !!');
    }

    const conRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status
    });
   const requestStatus= await conRequest.save();
   if(!requestStatus){
    return  response(res,400,null,"something went wrong !!");
   }
    return response(res,200,requestStatus,`Connection request -${status} successfully !!`);
  } catch (error) {
    return response(res,400,null,error.message);
  }
})

module.exports = requestController;