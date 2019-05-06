import express from 'express';
import Usercontroller from '../../../controllers/user.controller';

const router = express.Router();

router.post('/signup', Usercontroller.addUser);

router.post('/login', Usercontroller.loginUser);

export default router;
