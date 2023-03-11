const db = require('../../config/connection');
const COLLECTION = require('../../config/collections');
const ObjectId = require('mongodb').ObjectId


//function to create a new task
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

//function to upadate a task with task id
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

//function to get a task by id
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

//function to get all tasks from DB
const getAllTasksDB =async(perPage=5,page=0) =>{
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

//function to delete a task by id
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

//function to get highest order index from records
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

//function to delete all tasks from collection
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

//function to bulk add tasks into collection
const bulkInsertTaskDB =async(tasks) =>{
    
    try {
      const task =  await db.get().collection(COLLECTION['TASKS']).insertMany(tasks);
        return{
            success:true,
            data:task.ops,
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