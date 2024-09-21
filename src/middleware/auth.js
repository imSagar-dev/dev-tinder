const adminAuth = (req,res,next)=>{
    const {token} = req.headers;
    
    console.log('header', token)
     if(token !='abcd'){
        res.status(401).send('Unauthorised')
     }else{
        next()
     }
    
}

module.exports = {adminAuth}