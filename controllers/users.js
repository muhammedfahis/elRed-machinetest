const niv = require('node-input-validator');
const {
    encrypt,
    validate
} = require('../libs/crypto/crypto');
const {
    jwtSignInFunction
} = require('../libs/jwt/jwt');
const {
    sendOtp
} = require('../libs/otp/otp');
const {
    getOtpDB,
    deleteOtpDB
} = require('../libs/db/otp');
const {
    registerUserDB,
    getSingleUserByEmailDB,
    updateUserByIdDB
} = require("../libs/db/users");




const register = (req, res) => {
    //gets email and password values from request body
    const {
        email,
        password
    } = req.body;
    //gives the inputs for validation
    const v = new niv.Validator(req.body, {
        email: 'required|email',
        password: 'required'
    });

    try {
        //check the inputs are valid or not. if they are not valid we immediately responds with invalid input error
        v.check().then(async matched => {
            if (!matched) {
                res.status(400).send({
                    "success": false,
                    "message": Object.values(v.errors)[0].message
                });
            } else {
                //if inputs are valid checks wether there is a user with same address
                let existingUser = await getSingleUserByEmailDB(email);
                if (!existingUser.data) {
                    //if there is no user with same address we encrypt user's password that no once can read it
                    let hashedPass = await encrypt(password);
                    //register new user with the input values and add 'verified' key for the verification purpose
                    const data = await registerUserDB({
                        email,
                        password: hashedPass,
                        verified: false
                    });
                    if (data.success) {
                        //if user saved in DB sends otp to user's email address 
                        await sendOtp(email, data.id);
                        //deletes id from user object
                        delete data.id;
                        //adds the message
                        data.message = 'Verfication Email Sent.'
                        //passes 200 success message everything goes fine and send the success message
                        res.status(200).send(data);
                    } else {
                        //passess 500 error and error message for DB errors
                        res.status(500).send(data);
                    }
                } else {
                    //passes 409 conflict message if there is a user in DB already with same address or user Already registered
                    res.status(409).send({
                        "success": false,
                        "message": 'User Already Exists'
                    });
                }

            }
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        });
    }

}

const login = (req, res) => {
    //gets email and password inputs values from request body
    const {
        email,
        password
    } = req.body;
    //passes input values for validation
    const v = new niv.Validator(req.body, {
        email: 'required|email',
        password: 'required'
    });

    try {
        //check the inputs are valid or not. if they are not valid we immediately responds with invalid input error
        v.check().then(async matched => {
            if (!matched) {
                res.status(400).send({
                    "success": false,
                    "message": Object.values(v.errors)[0].message
                });
            } else {
                //gets user with email address with db to check wether email is valid or not
                const userData = await getSingleUserByEmailDB(email);
                if (userData.data) {
                    //if user is valid then checks the user verified the otp or not
                    if (!userData.data.verified) {
                        //if user not verified otp then immedietly responds with error response
                        res.status(400).send({
                            "success": false,
                            "message": 'Invalid Account Details.'
                        });
                    } else {
                        //if user is valid and verified then takes users hashed password from DB
                        let hashedPass = userData.data.password;
                        //checks given password value and password stored in DB are identical
                        let valid = await validate(password, hashedPass);
                        if (valid) {
                            //if both password are identical we generate new token
                            const jwtToken = await jwtSignInFunction(userData.data._id);
                            //delete password from response object
                            delete userData.data.password;
                            let resData = {
                                success: true,
                                message: 'User logined successfully',
                                userData: userData.data,
                                token: jwtToken
                            }
                            //if everything goes fine responds with 200 success and token object
                            res.status(200).send(resData);
                        } else {
                            //if passwords do not match responds with invalid password error
                            res.status(400).send({
                                "success": false,
                                "message": 'Incorrect Password'
                            });
                        }
                    }
                } else {
                    //if email is not valid responds with invalid email error
                    res.status(400).send({
                        "success": false,
                        "message": 'Incorrect Email'
                    });
                }
            }
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
}


const verifyOtp = async (req, res) => {
    //gets userId and otp value from request body
    const {
        userId,
        otp
    } = req.body;
    try {
        //if either userId or otp missing throws error with invalid inputs
        if (!userId || !otp) {
            throw new Error('Empty otp details are not allowed.')
        } else {
            //if inputs are not empty takes otp object from otp collection using userId
            const otpData = await getOtpDB(userId);
            if (!otpData.data.length) {
                //if otp not found throws error
                throw new Error('Account record does not exist or already verified,please sign up or log in');
            } else {
                //if otp found takes otp expiration time and hashed otp
                let expiresAt = otpData.data[0].expiresAt;
                let hashedOtp = otpData.data[0].otp;
                if (expiresAt < Date.now()) {
                    //if otp expired throws error and clear all details of current user
                    await deleteOtpDB(userId);
                    throw new Error('Code has expired.Please request again');
                } else {
                    //if otp is not expired checkes otps are matched or not
                    const matched = await validate(otp, hashedOtp);
                    if (!matched) {
                        //if otps are different throws error
                        throw new Error('Invalid code passed. Check your inbox');
                    } else {
                        //if otps are identical make the user verified status
                        await updateUserByIdDB(userId, {
                            verified: true
                        });
                        //clears all records of current user
                        await deleteOtpDB(userId);
                        //generate new token for current user
                        const jwtToken = await jwtSignInFunction(userId);
                        //resonds with 200 success and token object
                        res.status(200).send({
                            success: true,
                            token: jwtToken,
                            message: 'User verified Successfully.'
                        });
                    }
                }
            }
        }
    } catch (error) {
        //if something went wrong responds with error message
        res.status(400).send({
            success: false,
            message: error.message
        });
    }
}



module.exports = {
    register,
    login,
    verifyOtp
}