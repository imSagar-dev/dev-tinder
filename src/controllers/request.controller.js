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

    const allowedStatus = ['interested', 'ignored'];
    if(!allowedStatus.includes(status)){
      return response(res,400,null,'invalid status request!!');
    }
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
});

requestController.post('/review/:status/:requestId',async (req,res)=>{
  try {
    const {status, requestId} = req.params;
    const toUserId = req.user._id;

    const allowedStatus = ['accepted', 'rejected'];
    if(!allowedStatus.includes(status)){
      return response(res,400,null,'invalid status request!!');
    }
    //find connection request for logged in user and should be interested status
    const connectionRequest = await ConnectionRequest.findOne({
      _id:requestId,
     toUserId:toUserId,
     status:'interested'
    });


    if(!connectionRequest){
      return response(res,400,null,'Request not found !!');
    }

    connectionRequest.status = status;
   const requestStatus= await connectionRequest.save();
   if(!requestStatus){
    return  response(res,400,null,"something went wrong !!");
   }
    return response(res,200,requestStatus,`Connection request -${status} successfully !!`);
  } catch (error) {
    return response(res,400,null,error.message);
  }
});



requestController.get('/getAllRequests',async (req,res)=>{
  try {
   
    const toUserId = req.user._id;

    const connectionRequest = await ConnectionRequest.find({
     toUserId:toUserId,
     status:'accepted'
    }).populate("fromUserId","firstName lastName profileImage");

    if(!connectionRequest){
      return response(res,400,null,'Request not found !!');
    }

    return response(res,200,connectionRequest,'Connections found successfully !!');
  } catch (error) {
    return response(res,400,null,error.message);
  }
})

module.exports = requestController;