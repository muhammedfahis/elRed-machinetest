const niv = require('node-input-validator');
const { get } = require('../config/connection');

const {
    createTaskDB,
    updateTaskDB,
    getSingleTaskByIdDB,
    getAllTasksDB,
    deleteTaskByIdDB
  } = require("../libs/db/task");


const createTask = (req,res) => {
    const v = new niv.Validator(req.body, {
        taskName: 'required',
        taskStatus: 'required',
        taskDate:'required'
      });
    v.check().then(async matched => {
        if (!matched) {
            res.status(400).send({
              "success": false,
              "message": Object.values(v.errors)[0].message
            });
        } else {
         const { taskName,taskDate,taskStatus } = req.body;
         const data = await createTaskDB(req.body);
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
    let data = await getAllTasksDB();
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

module.exports = {
    createTask,
    updateTask,
    getAllTasks,
    deleteTask
}