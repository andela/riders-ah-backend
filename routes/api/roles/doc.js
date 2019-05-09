/**
 * @swagger
 * /users/:id:
 *   put:
 *     tags:
 *       - User
 *     name: role
 *     summary: update a user's role
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
 *             roles:
 *               type:string
 *         required:
 *           - roles
 *     responses:
 *           '200':
 *             description: role of the user updated successfuly
 *           '404':
 *             description: bad request
 */
