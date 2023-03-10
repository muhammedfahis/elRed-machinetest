const db = require('../../config/connection');
const COLLECTION = require('../../config/collections');
const ObjectId = require('mongodb').ObjectId



const createTaskDB =async(task) =>{

    try {
        await db.get().collection(COLLECTION['TASKS']).insertOne(task)
        return{
            success:true,
            message:'Task created Successfully'
        }
    } catch (error) {
        return {
            success:false,
            message:'Something went Wrong'
        }
    }
 
}


const updateTaskDB =async(task,id) =>{

    try {
        await db.get().collection(COLLECTION['TASKS']).updateOne({_id:new ObjectId(id)},{$set:task})
        return{
            success:true,
            message:'Task Updated Successfully'
        }
    } catch (error) {
        return {
            success:false,
            message:'Something went Wrong'
        }
    }
 
}

const getSingleTaskByIdDB =async(id) =>{
    
    try {
      const task =  await db.get().collection(COLLECTION['TASKS']).findOne({"_id":new ObjectId(id)});
        return{
            success:true,
            data:task,
            message:'Task fetched Successfully'
        }
    } catch (error) {
        return {
            success:false,
            message:'Something went Wrong'
        }
    }
 
}

const getAllTasksDB =async(perPage,page) =>{
    try {
      const tasks =  await db.get().collection(COLLECTION['TASKS']).find().skip(perPage * page).limit(+perPage).toArray()
        return{
            success:true,
            data:tasks,
            message:'Tasks fetched Successfully'
        }
    } catch (error) {
        return {
            success:false,
            message:'Something went Wrong'
        }
    }
 
}

const deleteTaskByIdDB =async(id) =>{
    
    try {
      const task =  await db.get().collection(COLLECTION['TASKS']).deleteOne({"_id":new ObjectId(id)});
        return{
            success:true,
            message:'Task deleted Successfully'
        }
    } catch (error) {
        return {
            success:false,
            message:'Something went Wrong'
        }
    }
 
}

const getHighestIndexDB =async() =>{
    
    try {
      const task =  await db.get().collection(COLLECTION['TASKS']).find().sort({index:-1}).limit(1).toArray()
        return{
            success:true,
            data:task,
            message:'Task fetched Successfully'
        }
    } catch (error) {
        return {
            success:false,
            message:'Something went Wrong'
        }
    }
 
}

const deleteAllTAsksDB =async() =>{
    
    try {
      const task =  await db.get().collection(COLLECTION['TASKS']).deleteMany()
        return{
            success:true,
            message:'Tasks deleted Successfully'
        }
    } catch (error) {
        return {
            success:false,
            message:'Something went Wrong'
        }
    }
 
}

const bulkInsertTaskDB =async(tasks) =>{
    
    try {
      const task =  await db.get().collection(COLLECTION['TASKS']).insertMany(tasks)
        return{
            success:true,
            message:'Tasks added Successfully'
        }
    } catch (error) {
        return {
            success:false,
            message:'Something went Wrong'
        }
    }
 
}


module.exports = {
    createTaskDB,
    updateTaskDB,
    getSingleTaskByIdDB,
    getAllTasksDB,
    deleteTaskByIdDB,
    getHighestIndexDB,
    deleteAllTAsksDB,
    bulkInsertTaskDB
}