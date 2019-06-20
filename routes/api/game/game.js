import express from 'express';
import auth from '../../../middlewares/auth';
import gameController from '../../../controllers/game.controller';


const router = express.Router();

router.post('/', auth, gameController.createGameRoom);
router.post('/marks', auth, gameController.createUserMark);
router.get('/marks/:roomId', auth, gameController.getAllMarks);

export default router;
