const express = require('express');
const router = express.Router();

const { register,login,verifyOtp } = require('../controllers/users');

/**
 * @openapi
 * '/user/register':
 *  post:
 *    tags:
 *      - User
 *    summary: Register a new User
 *    requestBody:
 *      required: true
 *      content: 
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/createUserInput'
 *    responses:
 *        200:
 *          description: Success
 *          content: 
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/createUserResponse'
 *        409:
 *          description: Conflict(If the User Already Exists)
 *          content: 
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/createUserFailResponse'
 *        400:
 *          description: Bad Request(Validation Errors for Inputs)
 *          content: 
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/createUserFailResponse'
 *        500:
 *          description: For database Errors
 *          content: 
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/createUserFailResponse'
 *             
 * 
 */
router.post('/register',register);

/**
 * @openapi
 * '/user/login':
 *  post:
 *    tags:
 *      - User
 *    summary: login a new User
 *    requestBody:
 *      required: true
 *      content: 
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/createUserInput'
 *    responses:
 *        200:
 *          description: Success
 *          content: 
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/createUserLoginResponse'
 *        400:
 *          description: Bad Request(If there any validation errors or if user not verified or user gave wrong inputs)
 *          content: 
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/createUserFailResponse'
 *             
 * 
 */
router.post('/login',login);

/**
 * @openapi
 * '/user/verify':
 *  post:
 *    tags:
 *      - User
 *    summary: Verify user by entering otp sent to their email
 *    requestBody:
 *      required: true
 *      content: 
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/createOtpVerificationInput'
 *    responses:
 *        200:
 *          description: Success
 *          content: 
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/createVerificationResponse'
 *        400:
 *          description: Bad Request(Validation Errors for Inputs or invalid code passed or code expired )
 *          content: 
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/createUserFailResponse'
 *             
 * 
 */
router.post('/verify',verifyOtp);



module.exports =router