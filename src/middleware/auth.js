const jwt = require("jsonwebtoken");
const userModel = require("../models/user.schema");
const {response} = require("../utils/responseUtil");
const userAuth = async (req, res, next) => {
   try {
      const { token } = req.cookies;
  
      if (!token) {
        return response(res,400,null , 'Invalid token');
      }
    
      const decodedToken = jwt.decode(token, "secret@123");
      if (!decodedToken) {
        return response(res,400,null , 'Invalid token');
      }
      if (decodedToken.id) {
        const user = await userModel.findById(decodedToken.id);
    
        if (user) {
          req.user = user;
          next();
        } else {
          return response(res,400,null , 'User not found');
        }
      } else {
        return response(res,400,null , 'Invalid token');
      }
   } catch (error) {
      res.status(400).send(error.message)
   }
  
};

module.exports = { userAuth };
