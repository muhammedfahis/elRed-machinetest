const { transporter } = require('../../config/mail');
const { encrypt } = require('../crypto/crypto');
const  { saveOtpDB } = require('../db/otp');


const sendOtp = async (email,id) => {

    try {
        const otp = `${Math.floor(1000+Math.random()*9000)}`;
        var mailOptions = {
            from: process.env.EMAIL, // sender address
            to: email, // list of receivers
            subject: 'USER VERIFICATION',// Subject line
            html: `<p>Enter <b>${otp}</b> in the app to verify your email address and complete the verification process</p>
            this code will be available for one hour.`,// html body
        };
        let encryptedOtp = await encrypt(otp);
        let otpObj = {
            userId:id,
            otp:encryptedOtp,
            createdAt:Date.now(),
            expiresAt:Date.now() + 3600000
        }
        const resOtp = await saveOtpDB(otpObj);
        if(resOtp.success){
            await transporter.sendMail(mailOptions);
        }
    } catch (error) {
        console.log(error);
    }
}



module.exports = {
    sendOtp
}