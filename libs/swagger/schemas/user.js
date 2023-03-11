

/**
 * @openapi
 * components:
 *   schemas:
 *      createUserInput:
 *         type: object
 *         required:
 *           - email
 *           - password
 *         properties:
 *           email:
 *              type: string
 *              default: test@example.com
 *           password:
 *              type: string
 *              default: testPass@123
 *      createUserResponse:
 *         type: object
 *         properties:
 *          success:
 *             type: boolean
 *          message:
 *             type: string
 *      createUserLoginResponse:
 *         type: object
 *         properties:
 *          success:
 *             type: boolean
 *          message:
 *             type: string
 *          token:
 *             type: string
 *          userData:
 *             type: object
 *             properties:
 *              _id:
 *                 type: string
 *              email:
 *                 type: string
 *              verified:
 *                 type: boolean
 *                 default: true
 *      createUserFailResponse:
 *         type: object
 *         properties:
 *          success:
 *             type: boolean
 *             default: false
 *          message:
 *             type: string
 *      createOtpVerificationInput:
 *         type: object
 *         required:
 *           - userId
 *           - otp
 *         properties:
 *           userId:
 *              type: string
 *              default: 640b19419f962a732893f91b
 *           otp:
 *              type: string
 *              default: 4479 
 *      createVerificationResponse:
 *         type: object
 *         properties:
 *          success:
 *             type: boolean
 *          message:
 *             type: string
 *          token:
 *             type: string
 *              
 *          
 *          
 */



