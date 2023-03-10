const db = require('../../config/connection');
const COLLECTION = require('../../config/collections');
const ObjectId = require('mongodb').ObjectId



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