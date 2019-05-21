import express from 'express';
import Usercontroller from '../../../controllers/user.controller';
import Uservalidator from '../../../helpers/userHelper';
import Auth from '../../../middlewares/auth';
import userMiddleware from '../../../middlewares/user.middleware';

const router = express.Router();
router.get('/', Auth, Usercontroller.listUsers);
router.post('/signup', Uservalidator.addUser, Usercontroller.addUser);
router.get('/verification', userMiddleware.validateParams, Usercontroller.verifyAccount);
router.post('/send/email', userMiddleware.validateEmail, Usercontroller.resentEmail);

router.post('/login', Usercontroller.loginUser);

export default router;
