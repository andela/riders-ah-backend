/**
 * @swagger
 * /messages:
 *   post:
 *     tags:
 *       - Message
 *     name: chat
 *     summary: send a message to online users
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: auth
 *         in: header
 *         schema:
 *           type:string
 *         required:
 *           -auth
 *       - name: body
 *         in: body
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type:string
 *         required:
 *           - message
 *     responses:
 *           '200':
 *             description: message
 *           '400':
 *             description: bad request
 * @swagger
 * /messages:
 *   get:
 *     tags:
 *       - Message
 *     name: chat
 *     summary: Get all messages
 *     parameters:
 *       - name: body
 *         schema:
 *           $ref:
 *           type: array
 *           properties:
 *         required:
 *     responses:
 *       '200':
 *         description: Ok
 */
