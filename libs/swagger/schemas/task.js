/**
 * @openapi
 * components:
 *   schemas:
 *      createTaskInput:
 *         type: object
 *         required:
 *           - taskName
 *           - taskDate
 *           - taskStatus
 *         properties:
 *           taskName:
 *              type: string
 *              default: testName
 *           taskDate:
 *              type: string
 *              default: 01-01-2023
 *           taskStatus:
 *              type: string
 *              default: Completed
 *              schema:
 *                enum: [asc, desc]
 *      createTaskResponse:
 *         type: object
 *         properties:
 *          success:
 *             type: boolean
 *          message:
 *             type: string
 *      createTaskGetListResponse:
 *         type: object
 *         properties:
 *          success:
 *             type: boolean
 *          message:
 *             type: string
 *          data:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                _id:
 *                   type: string
 *                taskName:
 *                   type: string
 *                taskDate:
 *                   type: string
 *                taskStatus:
 *                   type: string
 *                index:
 *                   type: number
 *      createTaskFailResponse:
 *         type: object
 *         properties:
 *          success:
 *             type: boolean
 *             default: false
 *          message:
 *             type: string
 *      createTaskRearrangeInput:
 *         type: object
 *         required:
 *           - taskName
 *           - taskDate
 *           - taskStatus
 *         properties:
 *           tasks:
 *              type: array
 *              items:
 *                 type: object
 *                 properties:
 *                     taskName:
 *                        type: string
 *                        default: testName
 *                     taskDate:
 *                        type: string
 *                        default: 01-01-2023
 *                     taskStatus:
 *                        type: string
 *                        default: Completed
 *                     index:
 *                        type: number   
 *                        default: 1 
 *             
 */