import express from 'express';
import message from '../../../controllers/message.controller';
import auth from '../../../middlewares/auth';

const router = express.Router();

router.get('/', auth, message.getMessages);

export default router;
