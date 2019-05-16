/**
 * @swagger
 * /user/resetPasswordEmail:
 *   post:
 *     tags:
 *       - Send Reset Email Password
 *     name: Reset
 *     summary: Send a reset password Email to the user
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: body
 *         in: body
 *         schema:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *         required:
 *           - email
 *     responses:
 *       '200':
 *         description: The email have been sent successfully
 *       '400':
 *         description: User not found
 */

/**
 * @swagger
 * /user/resetPassword:
 *   post:
 *     tags:
 *       - Create new Password
 *     name: Reset
 *     summary: Create a New Password
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: authorization
 *         in: header
 *         schema:
 *           type: string
 *         required:
 *           - authorization
 *       - name: body
 *         in: body
 *         schema:
 *           type: object
 *           properties:
 *             newPassword:
 *               type: string
 *             confirmNewPassword:
 *               type: string
 *         required:
 *           - email
 *     responses:
 *       '200':
 *         description: The password has been reset successfully
 *       '400':
 *         description: User not found
 */
