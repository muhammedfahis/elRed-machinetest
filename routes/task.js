const express = require('express');
const router = express.Router();

const { createTask,updateTask,getAllTasks,deleteTask,rearrangeTask } = require('../controllers/task');

router.post('/create',createTask);
router.put('/update/:id',updateTask);
router.get('/list',getAllTasks);
router.delete('/delete/:id',deleteTask);
router.post('/rearrange',rearrangeTask);




module.exports =router