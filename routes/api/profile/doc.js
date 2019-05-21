/**
 * @swagger
 * definitions:
 *   Follow:
 *     type: object
 *     properties:
 *       follower:
 *         type: integer
 *       following:
 *         type: integer
 *       required:
 *         - follower
 *         - following
 * @swagger
 * /profiles/{username}/follow:
 *   post:
 *     tags:
 *       - Follow
 *     name: Following
 *     summary: Follow the users
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     parameters:
 *       - username: body
 *         in: body
 *         schema:
 *           $ref: '#/definitions/Follow'
 *           type: object
 *           properties:
 *     responses:
 *       '201':
 *         description: Follow action has successfully done
 *       '400':
 *         description: Bad request was made
 *       '401':
 *         description: Authentication required
 *       '404':
 *         description: User not found
 *       '409':
 *         description: Action already done
  * @swagger
 * /profiles/{username}/unfollow:
 *   post:
 *     tags:
 *       - Follow
 *     name: Following
 *     summary: Unfollow the users
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     parameters:
 *       - username: body
 *         in: body
 *         schema:
 *           $ref: '#/definitions/Follow'
 *           type: object
 *           properties:
 *     responses:
 *       '200':
 *         description: Unfollow action has successfully done
 *       '401':
 *         description: Authentication required
 *       '404':
 *         description: User not found
 * @swagger
 * /profiles/{username}/followers:
 *   get:
 *     tags:
 *       - Follow
 *     name: Followers list
 *     summary: Get list of user followers
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     parameters:
 *       - username: body
 *         in: body
 *         schema:
 *           $ref: '#/definitions/Follow'
 *           type: object
 *           properties:
 *     responses:
 *       '200':
 *         description: Action has successfully done
 *       '401':
 *         description: Authentication required
 * @swagger
 * /profiles/{username}/following:
 *   get:
 *     tags:
 *       - Follow
 *     name: Followings list
 *     summary: Get list of people a user is followings
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     parameters:
 *       - username: body
 *         in: body
 *         schema:
 *           $ref: '#/definitions/Follow'
 *           type: object
 *           properties:
 *     responses:
 *       '200':
 *         description: Action has successfully done
 *       '401':
 *         description: Authentication required
 *
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
