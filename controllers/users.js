const niv = require('node-input-validator');
const { encrypt ,validate } = require('../libs/crypto/crypto');
const { jwtSignInFunction } = require('../libs/jwt/jwt');
const { sendOtp } = require('../libs/otp/otp');
const  { getOtpDB,deleteOtpDB } = require('../libs/db/otp');
const {
    registerUserDB,
    getSingleUserByEmailDB,
    updateUserByIdDB
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
            if(!existingUser.data) {
                let hashedPass = await encrypt(password);
                const data = await registerUserDB({email,password:hashedPass,verified:false,test:'test'});
                if(data.success){
                    await sendOtp(email,data.id);
                    delete data.id;
                    data.message = 'Verfication Email Sent.'
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
            if(userData.data){
                if(!userData.data.verified) {
                    res.status(400).send({
                        "success": false,
                        "message": 'Invalid Account Details.'
                      });
                } else {
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


const verifyOtp = async (req,res) => {
    const { userId, otp } = req.body;
    try {
        if(!userId || !otp){
            throw new Error('Empty otp details are not allowed.')
        } else {
            const otpData = await getOtpDB(userId);
            if (!otpData.data.length) {
                throw new Error('Account record does not exist or already verified,please sign up or log in');
            } else {
                let expiresAt = otpData.data[0].expiresAt;
                let hashedOtp =  otpData.data[0].otp;
                if(expiresAt < Date.now()){
                    await deleteOtpDB(userId);
                    throw new Error('Code has expired.Please request again');
                } else {
                    const matched = await validate(otp,hashedOtp);
                    if(!matched){
                        throw new Error('Invalid code passed. Check your inbox');
                    } else {
                        await updateUserByIdDB(userId,{verified:true});
                        await deleteOtpDB(userId);
                        const jwtToken = await jwtSignInFunction(userId);
                        res.status(200).send({
                            success:true,
                            token:jwtToken,
                            message:'User verified Successfully.'
                        });
                    }
                }
            }
        }
    } catch (error) {
        res.status(400).send({
            success:false,
            message:error.message
        });
    }
}



module.exports = {
    register,
    login,
    verifyOtp
}