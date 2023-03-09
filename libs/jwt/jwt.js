const jwt = require('jsonwebtoken');
const JwtConfig = require('../../config/jwt.json');


async function jwtSignInFunction(payload) {
    let data = {
        date : new Date(),
        _id  : payload
    }
    try {
        const strToken = await jwt.sign(data, JwtConfig.secretKey, {
            expiresIn: "300s"
        });
        return "Bearer " + strToken;
    } catch (error) {
        new Error(error)
    }
}

const jwtVerifyFunction = async (strToken) => {
    try {
        return await jwt.verify(strToken, JwtConfig.secretKey)
    } catch (error) {
        new Error(error)
    }
}

const jwtDecodeFunction = async (token) => {
    try {
        return jwt.decode(token, {
            complete: true
        })
    } catch (error) {
        new Error(error)
    }
}


module.exports = {
    jwtSignInFunction,
    jwtVerifyFunction,
    jwtDecodeFunction
}