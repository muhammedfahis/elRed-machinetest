const express = require('express');
const router = express.Router();

const taskRouter = require('./task');
const userRouter = require('./users');
const invalidRequestHandler = require('../libs/middleware/invalidRequestHandler');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.status(200).send({
        success:true,
        title: 'Nodejs Task Project Test '
    });
});
router.use(invalidRequestHandler);
router.use('/task', taskRouter)
router.use('/user', userRouter)
module.exports = router;