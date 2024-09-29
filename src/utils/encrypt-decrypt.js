const bcrypt = require('bcrypt')
const encryption = (password)=>{
   return bcrypt.hash(password,5);
}

const decryption = (password , hash)=>{
    return bcrypt.compare(password, hash);
}

module.exports ={encryption , decryption};