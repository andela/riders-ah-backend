import express from 'express';
import passport from 'passport';
import Strategy from '../../config/passport';
import userController from '../../controllers/user.controller';


const router = express.Router();


const allStrategy = new Strategy();
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

router.get('/facebook', passport.authenticate(allStrategy.strategyTouse('facebook')));
router.get('/facebook/callback', passport.authenticate(allStrategy.strategyTouse('facebook'), { session: false }), userController.socialAuth);

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
router.get('/google', passport.authenticate(allStrategy.strategyTouse('google'), { scope: ['email'] }));
router.get('/google/callback', passport.authenticate(allStrategy.strategyTouse('google'), { scope: ['email', 'profile'], session: false }), userController.socialAuth);

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
router.get('/twitter', passport.authenticate(allStrategy.strategyTouse('twitter'), { scope: ['email'] }));
router.get('/twitter/callback', passport.authenticate(allStrategy.strategyTouse('twitter'), { scope: ['email'], session: false }), userController.socialAuth);

export default router;
