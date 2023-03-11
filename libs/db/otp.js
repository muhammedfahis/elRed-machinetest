const db = require('../../config/connection');
const COLLECTION = require('../../config/collections');
const ObjectId = require('mongodb').ObjectId


//function to save otp into db for a user
const saveOtpDB =async(otp) =>{

    try {
        await db.get().collection(COLLECTION['OTP']).insertOne(otp)
        return{
            success:true,
            message:'Otp saved Successfully'
        }
    } catch (error) {
        return {
            success:false,
            message:'Something went Wrong'
        }
    }
 
}
//function to get otp for a user
const getOtpDB =async(id) =>{

    try {
       const otp = await db.get().collection(COLLECTION['OTP']).find({userId:new ObjectId(id)}).toArray()
        return{
            success:true,
            data:otp,
            message:'Otp fetched Successfully'
        }
    } catch (error) {
        return {
            success:false,
            message:'Something went Wrong'
        }
    }
 
}
//function to delete all otp records for a user
const deleteOtpDB =async(id) =>{

    try {
       await db.get().collection(COLLECTION['OTP']).deleteMany({userId:new ObjectId(id)})
        return{
            success:true,
            message:'Otp deleted Successfully'
        }
    } catch (error) {
        return {
            success:false,
            message:'Something went Wrong'
        }
    }
 
}

module.exports = {
    saveOtpDB,
    getOtpDB,
    deleteOtpDB
}