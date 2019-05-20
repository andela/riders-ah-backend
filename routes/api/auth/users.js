import express from 'express';
import Usercontroller from '../../../controllers/user.controller';
import Uservalidator from '../../../helpers/userHelper';
import Auth from '../../../middlewares/auth';

const router = express.Router();
router.get('/', Auth, Usercontroller.listUsers);
router.post('/signup', Uservalidator.addUser, Usercontroller.addUser);

router.post('/login', Usercontroller.loginUser);

export default router;
