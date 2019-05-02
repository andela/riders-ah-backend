import express from 'express';
import users from '../../../controllers/profile';
import auth from '../../../middlewares/auth';
import canEditProfile from '../../../middlewares/editProfile';

const router = express.Router();

router.get('/:id', users.user);

router.put('/:id', auth, canEditProfile, users.editProfile);

export default router;
