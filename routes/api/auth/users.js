import express from 'express';
import Usercontroller from '../../../controllers/user.controller';
import Uservalidator from '../../../helpers/userHelper';
import Auth from '../../../middlewares/auth';
import userMiddleware from '../../../middlewares/user.middleware';
import Role from '../../../middlewares/roles';


const router = express.Router();
router.get('/', Auth, Usercontroller.listUsers);
router.post('/signup', Uservalidator.addUser, Usercontroller.addUser);
router.get('/verification', userMiddleware.validateParams, Usercontroller.verifyAccount);
router.post('/send/email', userMiddleware.validateEmail, Usercontroller.resentEmail);

router.post('/login', Uservalidator.isAccountActive, Usercontroller.loginUser);
router.post('/', Auth, Role.isSuperAdmin, Uservalidator.isValidInfo, Uservalidator.addUser, Usercontroller.createUser);
router.put('/:username', Auth, Role.isSuperAdmin, Uservalidator.checkEmail, Uservalidator.isValidUpdateInfo, Usercontroller.updateUser);
router.get('/:username', Auth, Role.isSuperAdmin, Usercontroller.getUser);
router.put('/:username/active/:action', Auth, Role.isSuperAdmin, Uservalidator.isValidAction, Uservalidator.isItAlreadySet, Usercontroller.enableOrDisableUser);

export default router;
