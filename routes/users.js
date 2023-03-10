const express = require('express');
const router = express.Router();

const { register,login,verifyOtp } = require('../controllers/users');

router.post('/register',register);
router.post('/login',login);
router.post('/verify',verifyOtp);



module.exports =router