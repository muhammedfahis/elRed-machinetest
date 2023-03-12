const express = require('express');
const router = express.Router();

let taskRouter = require('./task')
let userRouter = require('./users')

/* GET home page. */
router.get('/', function (req, res, next) {
    res.status(200).send({
        success:true,
        title: 'Nodejs Task Project Test '
    });
});

router.use('/', (req, res, next) => {
    if ((req.method == 'POST') && (!req.is('application/json') && !req.is('multipart/form-data'))) {
        res.status(400).send({
            status: "failed",
            message: "The request content type should be 'application/json' or 'multipart/form-data'"
        });
    } else {
        next();
    }
});

router.use('/task', taskRouter)
router.use('/user', userRouter)
module.exports = router;