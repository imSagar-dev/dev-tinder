const jwt = require("jsonwebtoken");
const userModel = require("../models/user.schema");
const userAuth = async (req, res, next) => {
   try {
      const { token } = req.cookies;
  
      if (!token) {
        throw new Error("Invalid token");
      }
    
      const decodedToken = jwt.decode(token, "secret@123");
      if (!decodedToken) {
        throw new Error("Invalid token");
      }
      if (decodedToken.id) {
        const user = await userModel.findById(decodedToken.id);
    
        if (user) {
          req.user = user;
          next();
        } else {
          throw new Error("User not found");
        }
      } else {
        throw new Error("Invalid token");
      }
   } catch (error) {
      res.status(400).send(error.message)
   }
  
};

module.exports = { userAuth };
