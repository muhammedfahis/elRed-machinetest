const { transporter } = require('../../config/mail');
const { encrypt } = require('../crypto/crypto');
const  { saveOtpDB } = require('../db/otp');


const sendOtp = async (email,id) => {

    try {
        //generate new otp
        const otp = `${Math.floor(1000+Math.random()*9000)}`;
        //configure mail option and mail template
        var mailOptions = {
            from: process.env.EMAIL, // sender address
            to: email, // list of receivers
            subject: 'USER VERIFICATION',// Subject line
            html: `<p>Enter <b>${otp}</b> in the app to verify your email address and complete the verification process</p>
            this code will be available for one hour.`,// html body
        };
        //encrypt otp to save database
        let encryptedOtp = await encrypt(otp);
        //create otp object and addes the expiration time
        let otpObj = {
            userId:id,
            otp:encryptedOtp,
            createdAt:Date.now(),
            expiresAt:Date.now() + 3600000
        }
        //save otp in DB
        const resOtp = await saveOtpDB(otpObj);
        if(resOtp.success){
            //if otp saved successfully send mail to user's email with otp
            await transporter.sendMail(mailOptions);
        }
    } catch (error) {
        console.log(error);
    }
}



module.exports = {
    sendOtp
}