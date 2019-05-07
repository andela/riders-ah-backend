/**
 * @swagger
 * definitions:
 *   Signup:
 *     type: object
 *     properties:
 *       username:
 *         type: string
 *       email:
 *         type: string
 *       password:
 *         type: string
 *         format: password
 *       required:
 *         - email
 *         - username
 *         - password
 */

/**
 * @swagger
 * /users/signup:
 *   post:
 *     tags:
 *       - User
 *     name: Signup
 *     summary: Signup a user in a system
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: body
 *         in: body
 *         schema:
 *           $ref: '#/definitions/Signup'
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *             password:
 *               type: string
 *               format: password
 *         required:
 *           - email
 *           - username
 *           - password
 *     responses:
 *       '200':
 *        description: User  logged in successfully
 *       '404':
 *        description: Url Not found
 *       '400':
 *        description: Bad request
 *       '500':
 *        description: Internal Server Error
 */

/**
 * @swagger
 * definitions:
 *   Login:
 *     type: object
 *     properties:
 *       email:
 *         type: string
 *       password:
 *         type: string
 *         format: password
 *       required:
 *         - email
 *         - password
 */

/**
 * @swagger
 * /users/login:
 *   post:
 *     tags:
 *       - User
 *     name: Login
 *     summary: Log a user in a system
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: body
 *         in: body
 *         schema:
 *           $ref: '#/definitions/Login'
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *             password:
 *               type: string
 *               format: password
 *         required:
 *           - email
 *           - password
 *     responses:
 *       '200':
 *         description: User  logged in successfully
 *       '409':
 *         description: Incorrect credentials.
 *       '404':
 *        description: Url Not found
 */
/**
 * @swagger
 * definitions:
 *   User:
 *     type: object
 *     properties:
 *       id:
 *         type: integer
 *       username:
 *         type: string
 *       email:
 *         type: string
 *       bio:
 *         type: string
 *       password:
 *         type: string
 *         format: password
 *       required:
 *         - email
 *         - username
 *         - password
 */

/**
 * @swagger
 * /login/facebook/:
 *   get:
 *     tags:
 *       - User
 *     name: Login with facebook
 *     summary: Sign up or Login in a system using facebook
 *     parameters:
 *       - name: body
 *         in: body
 *         schema:
 *           $ref: '#/definitions/User'
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *             password:
 *               type: string
 *               format: password
 *         required:
 *           - email
 *           - password
 *     responses:
 *       '201':
 *         description: User  created and logged in successfully
 *       '200':
 *         description: An existing User authenticated successfully.
 */
/**
 * @swagger
 * /login/google/:
 *   get:
 *     tags:
 *       - User
 *     name: Login with google
 *     summary: Sign up or Login in a system using google
 *     parameters:
 *       - name: body
 *         in: body
 *         schema:
 *           $ref: '#/definitions/User'
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *             password:
 *               type: string
 *               format: password
 *         required:
 *           - email
 *           - password
 *     responses:
 *       '201':
 *         description: User  created and logged in successfully
 *       '200':
 *         description: An existing User authenticated successfully.
 */

/**
 * @swagger
 * /login/twitter/:
 *   get:
 *     tags:
 *       - User
 *     name: Login with twitter
 *     summary: Sign up or Login in a system using twitter
 *     parameters:
 *       - name: body
 *         in: body
 *         schema:
 *           $ref: '#/definitions/User'
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *             password:
 *               type: string
 *               format: password
 *         required:
 *           - email
 *           - password
 *     responses:
 *       '201':
 *         description: User  created and logged in successfully
 *       '200':
 *         description: An existing User authenticated successfully.
 */
