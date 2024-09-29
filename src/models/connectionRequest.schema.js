const mongoose = require('mongoose');
const connectionRequestSchema = mongoose.Schema({
    fromUserId:{
        type: mongoose.SchemaTypes.ObjectId,
        required:true
    },
    toUserId:{
        type:mongoose.SchemaTypes.ObjectId,
        required:true
    },
    status:{
        type:String,
        enum:{
            values:["interested","ignore","accept","reject"],
            message:'{VALUE} is invalid status !!'
        },
        required:true
    }
},{timestamps:true});

connectionRequestSchema.index({fromUserId:1, toUserId:1});

connectionRequestSchema.pre("save",function(){
    const request = this;
    if(request.fromUserId.equals(request.toUserId)){
        throw new Error('You cannot send request to yourself !!');
    }
})

const connectionRequest = new mongoose.model('connectionRequest', connectionRequestSchema);

module.exports = connectionRequest;