/**
 * @swagger
 * /users/:id:
 *   get:
 *     tags:
 *       - User
 *     name: profile
 *     summary: get a user profile
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: body
 *         in: body
 *         schema:
 *           $ref: '#/definitions/User'
 *           type: object
 *           properties:
 *             bio:
 *               type: string
 *             image:
 *               type: string
 *             required:
 *               - username
 *               - bio
 *               - image
 *         responses:
 *           '202':
 *             description: field edited successfully
 *           '400':
 *             description: bad request
 */
/**
 * @swagger
 * /users/:id:
 *   put:
 *     tags:
 *       - User
 *     name: profile
 *     summary: get a user profile
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     parameters:
 *       - username: body
 *         in: body
 *         schema:
 *           $ref: '#/definitions/User'
 *           type: object
 *           properties:
 *             bio:
 *               type: string
 *             image:
 *               type: string
 *             required:
 *               - username
 *               - bio
 *               - image
 *         responses:
 *           '200':
 *             description: field edited successfully
 *           '400':
 *             description: bad request
 */
