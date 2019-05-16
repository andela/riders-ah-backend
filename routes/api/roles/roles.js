import express from 'express';
import Roles from '../../../controllers/roles';
import auth from '../../../middlewares/auth';
import Role from '../../../middlewares/roles';

const router = express.Router();

router.put('/:id', auth, Role.isSuperAdmin, Roles);

export default router;
