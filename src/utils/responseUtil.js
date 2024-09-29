const response = (res , statusCode, data,message )=>{
    res.status(statusCode).json({status: statusCode , data:data , message:message});
}

module.exports = {response};