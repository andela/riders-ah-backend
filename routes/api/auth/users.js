import express from 'express';
import Usercontroller from '../../../controllers/user.controller';
import Uservalidator from '../../../helpers/userHelper';

const router = express.Router();

router.post('/signup', Uservalidator.addUser, Usercontroller.addUser);

router.post('/login', Usercontroller.loginUser);

export default router;
