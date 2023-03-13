const express = require('express');
const router = express.Router();
const auth = require('../libs/middleware/auth');

const { createTask,updateTask,getAllTasks,deleteTask,rearrangeTask } = require('../controllers/task');

/**
 * @openapi
 * '/task':
 *  post:
 *    tags:
 *      - Task
 *    summary: create a new Task
 *    parameters:
 *     - name: auth
 *       in: query
 *       description: Bearer Token
 *       required: true
 *       schema:
 *         type: string
 *    requestBody:
 *      required: true
 *      content: 
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/createTaskInput'
 *    responses:
 *        200:
 *          description: Success
 *          content: 
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/createTaskResponse'
 *        400:
 *          description: Bad Request(Validation Errors for Inputs)
 *          content: 
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/createTaskFailResponse'
 *        500:
 *          description: For database Errors
 *          content: 
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/createTaskFailResponse'
 *             
 * 
 */
router.post('/',auth,createTask);

/**
 * @openapi
 * '/task/{id}':
 *  put:
 *    tags:
 *      - Task
 *    summary: update a task using Task iD
 *    parameters:
 *     - name: id
 *       in: path
 *       description: Id of task
 *       required: true
 *     - name: auth
 *       in: query
 *       description: Bearer Token
 *       required: true
 *       schema:
 *         type: string
 *    requestBody:
 *      required: true
 *      content: 
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/createTaskInput'
 *    responses:
 *        200:
 *          description: Success
 *          content: 
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/createTaskResponse'
 *        400:
 *          description: Bad Request(Validation Errors for Inputs or If the Id is invalid)
 *          content: 
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/createTaskFailResponse'
 *        500:
 *          description: For database Errors
 *          content: 
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/createTaskFailResponse'
 *             
 * 
 */
router.put('/:id',auth,updateTask);

/**
 * @openapi
 * '/task':
 *  get:
 *    tags:
 *      - Task
 *    summary: Get Task List
 *    parameters:
 *     - name: page
 *       in: query
 *       description: Number of page
 *       required: false
 *       schema:
 *         type: number
 *     - name: limit
 *       in: query
 *       description: Number of items per page
 *       required: false
 *       schema:
 *         type: number
 *     - name: auth
 *       in: query
 *       description: Bearer token
 *       required: true
 *       schema:
 *         type: string
 *    responses:
 *        200:
 *          description: Success
 *          content: 
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/createTaskGetListResponse'
 *        500:
 *          description: For database Errors
 *          content: 
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/createTaskFailResponse'
 *             
 * 
 */
router.get('/',auth,getAllTasks);

/**
 * @openapi
 * '/task/{id}':
 *  delete:
 *    tags:
 *      - Task
 *    summary: delete a task using Task iD
 *    parameters:
 *     - name: id
 *       in: path
 *       description: Id of task
 *       required: true
 *     - name: auth
 *       in: query
 *       description: Bearer Token
 *       required: true
 *       schema:
 *         type: string
 *    responses:
 *        200:
 *          description: Success
 *          content: 
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/createTaskResponse'
 *        500:
 *          description: For database Errors
 *          content: 
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/createTaskFailResponse'
 *             
 * 
 */
router.delete('/:id',auth,deleteTask);

/**
 * @openapi
 * '/task/rearrange':
 *  post:
 *    tags:
 *      - Task
 *    summary: rearragange the tasks
 *    parameters:
 *     - name: auth
 *       in: query
 *       description: Bearer Token
 *       required: true
 *       schema:
 *         type: string
 *    requestBody:
 *      required: true
 *      content: 
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/createTaskRearrangeInput'
 *    responses:
 *        200:
 *          description: Success
 *          content: 
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/createTaskGetListResponse'
 *        500:
 *          description: For database Errors
 *          content: 
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/createTaskFailResponse'
 *             
 * 
 */
router.post('/rearrange',auth,rearrangeTask);




module.exports =router