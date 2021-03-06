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
 * /users:
 *   get:
 *     tags:
 *       - User
 *     name: List all users
 *     summary: Get a list of users with following
 *     parameters:
 *       - name: body
 *         schema:
 *           $ref: '#/definitions/User'
 *           type: object
 *     responses:
 *       '200':
 *         description: Success
 *       '401':
 *         description: User is not authenticated.
 */
/**

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
/**
 * @swagger
 * definitions:
 *   Notification:
 *     type: object
 *     properties:
 *       id:
 *         type: integer
 *       userId:
 *         type: text
 *       notificationMessage:
 *         type: string
 */
/**
 * @swagger
 * /users/notification/set/:option:
 *   put:
 *     tags:
 *       - Notification
 *     name: Notification
 *     summary: set notification option
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     parameters:
 *       - option: param
 *         in: param
 *         schema:
 *           $ref: '#/definitions/Notification'
 *           type: object
 *           properties:
 *             userId:
 *               type: integer
 *             notificationMessage:
 *               type: text
 *         responses:
 *           '200':
 *             description: notification option setted
 */
/**
 * @swagger
 * /users/notification/unSet/:option:
 *   put:
 *     tags:
 *       - Notification
 *     name: Notification
 *     summary: unset notification option
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     parameters:
 *       - option: param
 *         in: param
 *         schema:
 *           $ref: '#/definitions/Notification'
 *           type: object
 *           properties:
 *             userId:
 *               type: integer
 *             notificationMessage:
 *               type: text
 *         responses:
 *           '200':
 *             description: notification option unsetted
 */
/**
 * @swagger
 * /users/notification/:
 *   get:
 *     tags:
 *       - Notification
 *     name: Notification
 *     summary: get a user Notifications
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: body
 *         in: body
 *         schema:
 *           $ref: '#/definitions/Notification'
 *           type: object
 *           properties:
 *             userId:
 *               type: integer
 *             notificationMessage:
 *               type: text
 *         responses:
 *           '200':
 *             description:  Notification received
 */
/**
 * @swagger
 * /users/verification?token={user-token}&email={user-email}:
 *   get:
 *     tags:
 *       - User
 *     name: User verification
 *     summary: Verifying user after creating an account
 *     parameters:
 *       - name: body
 *         schema:
 *           $ref: '#/definitions/User'
 *           type: object
 *     responses:
 *       '200':
 *         description: Account successfully verified
 *       '400':
 *         description: Token or email was not provided.
 *       '404':
 *         description: Token or email was not found into the system.
 */
/**
 * @swagger
 * /users/send/email:
 *   post:
 *     tags:
 *       - User
 *     name: Send email
 *     summary: Send verification email to the user
 *     parameters:
 *       - name: body
 *         schema:
 *           $ref: '#/definitions/User'
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *         required:
 *           - email
 *     responses:
 *       '200':
 *         description: Email successfully sent
 *       '400':
 *         description: Invalid email.
 *       '404':
 *         description: Email not found.
 *       '422':
 *         description: Unknown email type.
 */
