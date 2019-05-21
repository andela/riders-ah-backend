import express from 'express';
import statsController from '../../../controllers/read.stats.controller';
import auth from '../../../middlewares/auth';

const router = express.Router();

router.get('/reading/statistics', auth, statsController.getUserReadingStats);

export default router;
