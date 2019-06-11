import express from 'express';
import Usercontroller from '../../../controllers/user.controller';
import Uservalidator from '../../../helpers/userHelper';
import Auth from '../../../middlewares/auth';
import userMiddleware from '../../../middlewares/user.middleware';
import Role from '../../../middlewares/roles';
import catchErrors from '../../../middlewares/catch.errors.middleware';


const router = express.Router();
router.get('/', Auth, Usercontroller.listUsers);
router.post('/signup', catchErrors(Uservalidator.addUser), catchErrors(Usercontroller.addUser));
router.get('/verification', userMiddleware.validateParams, Usercontroller.verifyAccount);
router.post('/send/email', userMiddleware.validateEmail, Usercontroller.resentEmail);

router.post('/login', Uservalidator.isAccountActive, Usercontroller.loginUser);
router.post('/', Auth, Role.isSuperAdmin, Uservalidator.isValidInfo, Uservalidator.addUser, catchErrors(Usercontroller.createUser));
router.put('/:username', Auth, Role.isSuperAdmin, Uservalidator.checkEmail, Uservalidator.isValidUpdateInfo, Usercontroller.updateUser);
router.get('/:username', Auth, Role.isSuperAdmin, Usercontroller.getUser);
router.put('/:username/active/:action', Auth, Role.isSuperAdmin, Uservalidator.isValidAction, Uservalidator.isItAlreadySet, Usercontroller.enableOrDisableUser);
router.post('/logout', Auth, Usercontroller.signOut);

export default router;
