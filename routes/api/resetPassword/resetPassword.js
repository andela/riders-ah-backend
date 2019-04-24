import express from 'express';
import resetPassword from '../../../controllers/resetPassword.js';
import Auth from '../../../middlewares/auth.js';

const router = express.Router();

router.post('/resetPasswordEmail', resetPassword.resetPasswordEmail);
router.post('/resetPassword', Auth, resetPassword.resetPassword);

export default router;
