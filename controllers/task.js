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
    //getting inputs
    const {
        taskName,
        taskDate,
        taskStatus
    } = req.body;
    //gives inputs for validation
    try {
        const v = new niv.Validator(req.body, {
            taskName: 'required',
            taskStatus: 'required',
            taskDate: 'required'
        });
        //validates taskStatus enum type and gives response if condition not satisfied
        if (taskStatus !== 'Completed' && taskStatus !== 'Incomplete') {
            return res.status(400).send({
                "success": false,
                "message": 'Status Must be either Completed or Incomplete'
            });
        }
        //validates the inputs and immediate response for invalid inputs
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
                //removing spaces from input values
                taskObj.taskName = taskName.trim();
                taskObj.taskDate = taskDate.trim();
                taskObj.taskStatus = taskStatus.trim();
                //increment index value from the previous index if there is value in DB. otherwise we give 1 as defualt
                taskObj.index = latestTask.data[0] ? latestTask.data[0].index + 1 : 1;
                //create new task
                const data = await createTaskDB(taskObj);
                //gives 200 response if everything goes fine.otherwise we give 500 for database error
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
    //getting id of the task to update from params
    const id = req.params.id;
    //gives parameters for validation
    const v = new niv.Validator(req.params, {
        id: 'required',
    });
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
                    //gives 200 response if everything goes fine.otherwise we give 500 for database error
                    if (data.success) {
                        res.status(200).send(data);
                    } else {
                        res.status(500).send(data);
                    }

                } else {
                    //if the id is invalid passes invalid input error
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
    //get page number and items per page values from query parameter
    let {
        page,
        limit
    } = req.query;
    try {
        //get All tasks from databases
        let data = await getAllTasksDB(limit, page);
        //passes all tasks if there is no error or database error passes
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
        //getting id of the task to delete from params
        let id = req.params.id;
        if (id) {
            //if there is id deletes the document with the id
            const data = await deleteTaskByIdDB(id);
            if (data.success) {
                //gives 200 response if everything goes fine.otherwise we give 500 for database error
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
    //get the task array from request body which should be reaaranged
    let {
        tasks
    } = req.body;
    try {
        if (tasks.length) {
            //if there is task in array we rearrange the order of tasks using index
            tasks.forEach((task, index) => task.index = index + 1);
            //deletes all the tasks from database
            const deleteTask = await deleteAllTAsksDB();
            if (deleteTask.success) {
                //if deletion goes well we insert the rearranged tasks to DB
                const data = await bulkInsertTaskDB(tasks);
                //gives 200 response if everything goes fine.otherwise we give 500 for database error
                if (data.success) {
                    res.status(200).send(data)
                } else {
                    res.status(500).send(data);
                }
            } else {
                //if deletion no went well then we shows DB error
                res.status(500).send(deleteTask);
            }
        }
    } catch (error) {
        //if something went wrong we pass 500 error
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