const express = require('express');
const router = express.Router();

const { createTask,updateTask,getAllTasks,deleteTask } = require('../controllers/task');

router.post('/create',createTask);
router.put('/update/:id',updateTask);
router.get('/list',getAllTasks);
router.delete('/delete/:id',deleteTask);




module.exports =router