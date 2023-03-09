const db = require('../../config/connection');
const COLLECTION = require('../../config/collections');



const registerUserDB =async(user) =>{

    try {
        await db.get().collection(COLLECTION['USERS']).insertOne(user)
        return{
            success:true,
            message:'User registerd Successfully'
        }
    } catch (error) {
        return {
            success:false,
            message:'Something went Wrong'
        }
    }
 
}
const getSingleUserByEmailDB =async(email) =>{

    try {
       const user =  await db.get().collection(COLLECTION['USERS']).findOne({email:email})
        return{
            success:true,
            message:'User fetched Successfully',
            data:user
        }
    } catch (error) {
        return {
            success:false,
            message:'Something went Wrong'
        }
    }
 
}

module.exports = {
    registerUserDB,
    getSingleUserByEmailDB
}