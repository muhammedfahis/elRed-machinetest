const bcrypt = require("bcrypt");
const crypto = require('../../config/crypto.json');


const encrypt = async (value) => {
    return new Promise((resolve,reject) => {
        bcrypt
        .genSalt(crypto.saltRounds)
        .then(salt => {
        return bcrypt.hash(value, salt)
        })
        .then(hash => {
        resolve(hash);
        })
        .catch(err => console.error(err.message))
})
}

const validate = (value,hash) => {
  return new Promise((resolve,reject) => {
    bcrypt
    .compare(value, hash)
    .then(res => {
      console.log(res);
      resolve(res); 
    })
    .catch(err => console.error(err.message)) ;
  });
}

module.exports = {
    encrypt,
    validate
}
