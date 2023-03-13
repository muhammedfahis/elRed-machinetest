const niv = require('node-input-validator');
const {
    get
} = require('../config/connection');

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


const createTask = (req, res) => {

    const v = new niv.Validator(req.body, {
        taskName: 'required',
        taskStatus: 'required',
        taskDate: 'required'
    });
    const {
        taskName,
        taskDate,
        taskStatus
    } = req.body;
    try {
        //validates taskStatus enum type and gives response if condition not satisfied
        if (taskStatus !== 'Completed' && taskStatus !== 'Incomplete') {
            return res.status(400).send({
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
                //gets highest index from database
                const latestTask = await getHighestIndexDB();
                let taskObj = {};
                taskObj.taskName = taskName.trim();
                taskObj.taskDate = taskDate.trim();
                taskObj.taskStatus = taskStatus.trim();
                //increment index value from the previous index if there is value in DB. otherwise we give 1 as defualt
                taskObj.index = latestTask.data[0] ? latestTask.data[0].index + 1 : 1;
                const data = await createTaskDB(taskObj);
                if (data.success) {
                    res.status(200).send(data);
                } else {
                    res.status(500).send(data);
                }
            }
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
}

const updateTask = (req, res) => {

    const v = new niv.Validator(req.params, {
        id: 'required',
    });
    const id = req.params.id;
    try {
        //validates the parameters and gives validation error response for invalid inputs
        v.check().then(async matched => {
            if (!matched) {
                res.status(400).send({
                    "success": false,
                    "message": Object.values(v.errors)[0].message
                });
            } else {
                //checks wether there is a task with that ID
                const task = await getSingleTaskByIdDB(id);
                if (task) {
                    //if there is a task with id task updates with the new Values
                    const data = await updateTaskDB(req.body, id);
                    if (data.success) {
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
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
}

const getAllTasks = async (req, res) => {

    let {
        page,
        limit
    } = req.query;
    try {
        //get All tasks from databases
        let data = await getAllTasksDB(limit, page);
        if (data.success) {
            res.status(200).send(data);
        } else {
            res.status(500).send(data);
        }
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        });
    }

}

const deleteTask = async (req, res) => {
    try {
        let id = req.params.id;
        if (id) {
            //if there is id deletes the document with the id
            const data = await deleteTaskByIdDB(id);
            if (data.success) {
                res.status(200).send(data);
            } else {
                res.status(500).send(data);
            }
        }
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
}

const rearrangeTask = async (req, res) => {
    let {
        tasks
    } = req.body;
    try {
        if (tasks.length) {
            tasks.forEach((task, index) => task.index = index + 1);
            //deletes all the tasks from database
            const deleteTask = await deleteAllTAsksDB();
            if (deleteTask.success) {
                const data = await bulkInsertTaskDB(tasks);
                if (data.success) {
                    res.status(200).send(data)
                } else {
                    res.status(500).send(data);
                }
            } else {
                res.status(500).send(deleteTask);
            }
        }
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        })
    }
}

module.exports = {
    createTask,
    updateTask,
    getAllTasks,
    deleteTask,
    rearrangeTask
}