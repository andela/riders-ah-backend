import express from 'express';
import passport from 'passport';

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
 *       '200':
 *         description: User  logged in successfully
 *       '401':
 *         description: User not found
 *       '403':
 *         description: Unauthorized user
 *       '404':
 *        description: Url Not found
 */
const router = express.Router();

router.post('/users/login', (req, res, next) => {
  if (!req.body.user.email) {
    return res.status(422).json({ errors: { email: "can't be blank" } });
  }

  if (!req.body.user.password) {
    return res.status(422).json({ errors: { password: "can't be blank" } });
  }
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (user) {
      return res.json({ user: user.toAuthJSON() });
    }
    return res.status(422).json(info);
  })(req, res, next);
});

export default router;
