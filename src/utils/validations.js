const signupValidate=(req,res)=>{
    const PERMITTED_BODY = ["firstName","lastName","password","email","mobileNumber","age","gender","profileImage"];
   
    if(!Object.keys(req).every(k=>PERMITTED_BODY.includes(k))){
      throw new Error("Invalid request body");
    }
}

const validateLoginBody=(req,res)=>{
    const PERMITTED_BODY = ["username","password"];
   
    if(!Object.keys(req).every(k=>PERMITTED_BODY.includes(k))){
      throw new Error("Invalid request body");
    }
}

const validateChangePasswordBody=(req,res)=>{
  const PERMITTED_BODY = ["newPassword","password"];
 
  if(!Object.keys(req).every(k=>PERMITTED_BODY.includes(k))){
    throw new Error("Invalid request body");
  }
}

module.exports ={signupValidate , validateLoginBody, validateChangePasswordBody};