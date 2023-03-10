const niv = require('node-input-validator');
const { get } = require('../config/connection');

const {
    createTaskDB,
    updateTaskDB,
    getSingleTaskByIdDB,
    getAllTasksDB,
    deleteTaskByIdDB,
    getHighestIndexDB,
    deleteAllTAsksDB,
    bulkInsertTaskDB
  } = require("../libs/db/task");


const createTask = (req,res) => {
    const { taskName,taskDate,taskStatus } = req.body;
    const v = new niv.Validator(req.body, {
        taskName: 'required',
        taskStatus: 'required',
        taskDate:'required'
      });
    if(taskStatus !== 'Completed' || taskStatus !== 'Incomplete') {
        return  res.status(400).send({
            "success": false,
            "message": 'Status Must be either Completed or Incomplete'
          });
    }
    v.check().then(async matched => {
        if (!matched) {
            res.status(400).send({
              "success": false,
              "message": Object.values(v.errors)[0].message
            });
        } else {
         
         const latestTask = await getHighestIndexDB();
         let taskObj = {};
         taskObj.taskName = taskName.trim();
         taskObj.taskDate = taskDate.trim();
         taskObj.taskStatus = taskStatus.trim();
         taskObj.index = latestTask.data[0]?latestTask.data[0].index +1 : 1;
         const data = await createTaskDB(taskObj);
         if(data.success){
            res.status(200).send(data);
        } else {
            res.status(500).send(data);
        }
        } 
    });
}

const updateTask = ( req,res ) => {
    const id = req.params.id;
    const v = new niv.Validator(req.params, {
        id: 'required',
      });
    v.check().then(async matched => {
        if (!matched) {
            res.status(400).send({
              "success": false,
              "message": Object.values(v.errors)[0].message
            });
        } else {
            const task = await getSingleTaskByIdDB(id);
            if(task) {
                console.log(task);
                const data = await updateTaskDB(req.body,id);
                if(data.success){
                    res.status(200).send(data);
                } else {
                    res.status(500).send(data);
                }

            } else {
                res.status(400).send({
                    "success": false,
                    "message": 'No Task Found with Id'
                  });
            }
        } 
    });
}

const getAllTasks = async (req,res) => {
    let { page, limit} = req.query;
    let data = await getAllTasksDB(limit,page);
    if(data.success){
        res.status(200).send(data);
    } else {
        res.status(500).send(data);
    }

}

const deleteTask = async ( req, res) => {
    let id = req.params.id;
    const data = await deleteTaskByIdDB(id);
    if(data.success){
        res.status(200).send(data);
    } else {
        res.status(500).send(data);
    }
}

const rearrangeTask = async( req, res) => {
   let { tasks } = req.body;
   tasks.forEach((task,index) => task.index = index+1);
   const deleteTask = await deleteAllTAsksDB();
   if(deleteTask.success){
     const data = await bulkInsertTaskDB(tasks);
        if(data.success) {
            res.status(200).send(data)
        } else {
            res.status(500).send(data);
        }
   } else {
    res.status(500).send(deleteTask);
}
}

module.exports = {
    createTask,
    updateTask,
    getAllTasks,
    deleteTask,
    rearrangeTask
}