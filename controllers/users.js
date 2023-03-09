const niv = require('node-input-validator');
const { encrypt ,validate } = require('../libs/crypto/crypto');
const { jwtSignInFunction } = require('../libs/jwt/jwt');
const {
    registerUserDB,
    getSingleUserByEmailDB
  } = require("../libs/db/users");




const register = (req,res) => {
    const { email, password } = req.body;
    const v = new niv.Validator(req.body, {
        email: 'required|email',
      });
    v.check().then(async matched => {
        if (!matched) {
            res.status(400).send({
              "success": false,
              "message": Object.values(v.errors)[0].message
            });
        } else {
            let existingUser =  await getSingleUserByEmailDB(email);
            if(!existingUser) {
                let hashedPass = await encrypt(password);
                const data = await registerUserDB({email,password:hashedPass});
                if(data.success){
                    res.status(200).send(data);
                } else {
                    res.status(500).send(data);
                }
            } else {
                res.status(400).send({
                    "success": false,
                    "message": 'User Already Exists'
                  });
            }

        } 
    });

}

const login = (req,res) => {
    const { email, password } = req.body;
    const v = new niv.Validator(req.body, {
        email: 'required|email',
      });
    v.check().then(async matched => {
        if (!matched) {
            res.status(400).send({
              "success": false,
              "message": Object.values(v.errors)[0].message
            });
        } else {
            const userData = await getSingleUserByEmailDB(email);
            if(userData){
                let hashedPass = userData.data.password;
                let valid = await validate(password,hashedPass);
                if(valid){
                    const jwtToken = await jwtSignInFunction(userData.data._id);
                    let resData = {
                        success:true,
                        message:'User logined successfully',
                        userData:userData.data,
                        token:jwtToken
                    }
                    res.status(200).send(resData);
                } else {
                    res.status(400).send({
                        "success": false,
                        "message": 'Incorrect Password'
                      });
                }
            } else {
                res.status(400).send({
                    "success": false,
                    "message": 'Incorrect Email'
                  });
            }
        } 
    });
}

module.exports = {
    register,
    login
}